import express, { Request, Response, Router, RequestHandler } from "express";
import { login, updateUser, userCollectionMTG } from "../database";
import { User } from "../types";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

// Extend Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    user?: User;
    userId?: string;
    message?: {
      type: "error" | "success";
      message: string;
    };
  }
}

interface FlashRequest extends Request {
  flash(type: string, message: string): void;
}

export function accountRouter(): Router {
  const router = express.Router();

  // GET /login: Render de loginpagina
  router.get("/login", ((req: Request, res: Response) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("login");
  }) as RequestHandler);

  // POST /login: Verwerk het loginformulier
  router.post("/login", (async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        req.session.message = {
          type: "error",
          message: "Vul alle velden in!"
        };
        return res.redirect("/account/login");
      }

      const user = await login(username, password);

      req.session.user = user;
      req.session.message = {
        type: "success",
        message: "Je bent succesvol ingelogd!"
      };

      res.redirect("/");

    } catch (e) {
      console.error("Login error:", e);
      req.session.message = {
        type: "error",
        message: "Ongeldige gebruikersnaam of wachtwoord"
      };
      res.redirect("/account/login");
    }
  }) as RequestHandler);

  // GET /logout: Log de gebruiker uit
  router.get("/logout", ((req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) console.error("Logout error:", err);
      res.redirect("/account/login");
    });
  }) as RequestHandler);

  // POST /update-profile: Update gebruikersgegevens
  router.post("/update-profile", (async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const userId = req.session.user?._id;

    if (!userId) {
      res.status(401).send("Niet ingelogd");
      return;
    }

    try {
      const updatedData: { username?: string; password?: string; profileImage?: string } = {};
      if (username) updatedData.username = username;
      if (password) updatedData.password = password;

      const updateResult = await updateUser(new ObjectId(userId), updatedData);

      if (updateResult) {
        if (req.session.user && updatedData.username) {
          req.session.user.username = updatedData.username;
        }
        req.session.message = {
          type: "success",
          message: "Je gegevens zijn succesvol bijgewerkt!",
        };
        return res.redirect("/");
      } else {
        res.status(400).send("Er is een fout opgetreden bij het bijwerken.");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Serverfout bij het bijwerken van gebruikersgegevens.");
    }
  }) as RequestHandler);

  // GET /change-profile-image: Toon de pagina voor het wijzigen van de profielfoto
  router.get("/change-profile-image", ((req: Request, res: Response) => {
    if (!req.session.user) {
      return res.redirect("/account/login");
    }
    res.render("change-profile-image", {
      user: req.session.user,
      message: req.session.message
    });
  }) as RequestHandler);

  // POST /update-profile-image: Verwerk de nieuwe profielfoto URL
  router.post("/update-profile-image", (async (req: Request, res: Response) => {
    if (!req.session.user) {
      return res.status(401).send("Niet ingelogd");
    }

    try {
      const { imageUrl } = req.body;
      console.log("Ontvangen imageUrl:", imageUrl);
      console.log("User ID:", req.session.user._id);

      if (!imageUrl) {
        req.session.message = {
          type: "error",
          message: "Geen afbeelding URL opgegeven"
        };
        return res.redirect("/account/change-profile-image");
      }

      // Update de gebruiker met de nieuwe profielfoto URL
      const updateResult = await updateUser(new ObjectId(req.session.user._id), {
        profileImage: imageUrl
      });

      console.log("Update resultaat:", updateResult);

      if (updateResult) {
        // Update de sessie met de nieuwe profielfoto
        if (req.session.user) {
          req.session.user.profileImage = imageUrl;
        }

        req.session.message = {
          type: "success",
          message: "Profielfoto succesvol bijgewerkt!"
        };
        res.redirect("/user");
      } else {
        req.session.message = {
          type: "error",
          message: "Er is een fout opgetreden bij het bijwerken van de profielfoto"
        };
        res.redirect("/account/change-profile-image");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      req.session.message = {
        type: "error",
        message: "Er is een fout opgetreden bij het verwerken van de afbeelding"
      };
      res.redirect("/account/change-profile-image");
    }
  }) as RequestHandler);

  // Wachtwoord wijzigen
  router.post("/update-password", async (req: Request, res: Response) => {
    try {
      const userId = req.session.user?._id;
      console.log("Wachtwoord update poging voor gebruiker:", userId);

      if (!userId) {
        console.log("Geen gebruiker ID gevonden in sessie");
        return res.redirect("/login");
      }

      const { currentPassword, newPassword, confirmPassword } = req.body;
      console.log("Ontvangen wachtwoord data:", { currentPassword: !!currentPassword, newPassword: !!newPassword, confirmPassword: !!confirmPassword });

      const user = await userCollectionMTG.findOne({ _id: new ObjectId(userId) });
      console.log("Gebruiker gevonden:", !!user);

      if (!user) {
        console.log("Gebruiker niet gevonden in database");
        return res.redirect("/login");
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      console.log("Huidig wachtwoord correct:", isPasswordCorrect);

      if (!isPasswordCorrect) {
        console.log("Huidig wachtwoord is incorrect");
        req.session.message = {
          type: "error",
          message: "Huidig wachtwoord is incorrect"
        };
        return res.redirect("/user");
      }

      if (newPassword !== confirmPassword) {
        console.log("Nieuwe wachtwoorden komen niet overeen");
        req.session.message = {
          type: "error",
          message: "Nieuwe wachtwoorden komen niet overeen"
        };
        return res.redirect("/user");
      }

     
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("Nieuw wachtwoord gehashed");

      const updateResult = await userCollectionMTG.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
      console.log("Update resultaat:", updateResult);

      if (!updateResult.acknowledged) {
        console.log("Geen wijzigingen doorgevoerd in database");
        req.session.message = {
          type: "error",
          message: "Wachtwoord kon niet worden bijgewerkt"
        };
        return res.redirect("/user");
      }

      console.log("Wachtwoord succesvol bijgewerkt");

      // Sla het succesbericht op voordat we de sessie vernietigen
      const successMessage = {
        type: "success" as const,
        message: "Wachtwoord succesvol gewijzigd. Log opnieuw in met je nieuwe wachtwoord."
      };

      // Vernietig de sessie
      req.session.destroy((err) => {
        if (err) {
          console.error("Fout bij vernietigen sessie:", err);
          return res.redirect("/login");
        }

        // Redirect naar login met succesbericht als query parameter
        res.redirect("/login?message=" + encodeURIComponent(JSON.stringify(successMessage)));
      });

    } catch (error) {
      console.error("Fout bij wachtwoord update:", error);
      req.session.message = {
        type: "error",
        message: "Er is een fout opgetreden bij het wijzigen van het wachtwoord"
      };
      res.redirect("/user");
    }
  });

  // Account verwijderen
  router.post("/delete", async (req: Request, res: Response) => {
    try {
      const userId = req.session.user?._id;
      const { deleteConfirm } = req.body;

      if (!userId) {
        console.log("Geen gebruiker ID gevonden in sessie");
        return res.redirect("/login");
      }

      if (deleteConfirm !== "VERWIJDER") {
        console.log("Verkeerde bevestigingstekst");
        req.session.message = {
          type: "error",
          message: "Je moet 'VERWIJDER' typen om je account te verwijderen"
        };
        return res.redirect("/user");
      }

      // Verwijder de gebruiker uit de database
      const deleteResult = await userCollectionMTG.deleteOne({ _id: new ObjectId(userId) });
      console.log("Verwijder resultaat:", deleteResult);

      if (!deleteResult.acknowledged) {
        console.log("Account kon niet worden verwijderd");
        req.session.message = {
          type: "error",
          message: "Er is een fout opgetreden bij het verwijderen van je account"
        };
        return res.redirect("/user");
      }

      // Vernietig de sessie
      req.session.destroy((err) => {
        if (err) {
          console.error("Fout bij vernietigen sessie:", err);
          return res.redirect("/login");
        }

        // Redirect naar login met succesbericht
        const successMessage = {
          type: "success" as const,
          message: "Je account is succesvol verwijderd"
        };
        res.redirect("/login?message=" + encodeURIComponent(JSON.stringify(successMessage)));
      });

    } catch (error) {
      console.error("Fout bij verwijderen account:", error);
      req.session.message = {
        type: "error",
        message: "Er is een fout opgetreden bij het verwijderen van je account"
      };
      res.redirect("/user");
    }
  });

  return router;
}
