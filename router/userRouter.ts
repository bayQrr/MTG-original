import express from "express";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { getUserById, updateUser, deleteUser } from "../database";
import { User } from "../types";

export function userRouter() {
  const router = express.Router();

  // GET /profile
  router.get("/profile", (req, res) => {
    const user = (req.session as { user?: User }).user;
    if (!user) return res.redirect("/account/login");
    // Zorg dat je ook eventuele flash-messages doorstuurt:
    const message = (req.session as any).message;
    delete (req.session as any).message;
    res.render("user", { user, message });
  });

  // POST /update-profile
  router.post("/update-profile", async (req, res) => {
    const sessUser = (req.session as { user?: User }).user;
    if (!sessUser) {
      res.status(401).send("Niet ingelogd");
      return
    }
    const userId = new ObjectId(sessUser._id);

    const { username, email, avatar, oldPassword, newPassword } = req.body;
    const updatedData: {
      username?: string;
      password?: string;
      email?: string;
      avatar?: string;
    } = {};

    // Basis-updates
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (avatar) updatedData.avatar = avatar;

    // Wachtwoord wijzigen
    if (newPassword) {
      // eerst DB-record ophalen
      const dbUser = await getUserById(userId);
      if (!dbUser) {
        (req.session as any).message = {
          type: "error",
          message: "Gebruiker niet gevonden.",
        };
        res.redirect("/user/profile");
        return
      }
      // oud wachtwoord valideren
      const ok = await bcrypt.compare(oldPassword || "", dbUser.password);
      if (!ok) {
        (req.session as any).message = {
          type: "error",
          message: "Oud wachtwoord is onjuist.",
        };
        res.redirect("/user/profile");
        return
      }
      updatedData.password = newPassword;
    }

    try {
      const success = await updateUser(userId, updatedData);
      if (!success) {
        throw new Error("Update mislukt");
      }
      // sessie bijwerken
      Object.assign(req.session.user!, updatedData);

      (req.session as any).message = {
        type: "success",
        message: "Je gegevens zijn succesvol bijgewerkt!",
      };
      res.redirect("/user/profile");
      return
    } catch (err) {
      console.error(err);
      res.status(500).send("Serverfout bij het bijwerken van gebruikersgegevens.");
      return
    }
  });

  // POST /delete-account
  router.post("/delete-account", async (req, res) => {
    const sessUser = (req.session as { user?: User }).user;
    if (!sessUser) {
      res.status(401).send("Niet ingelogd");
      return
    }

    try {
      const deleted = await deleteUser(new ObjectId(sessUser._id));
      if (deleted) {
        req.session.destroy((err) => {
          if (err) console.error("Fout bij sessie vernietigen:", err);
          res.redirect("/");
        });
      } else {
        throw new Error("Kon account niet verwijderen.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Serverfout bij het verwijderen van account.");
    }
  });

  return router;
}
