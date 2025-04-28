import express from "express";
import { login, updateUser } from "../database";
import { FlashMessage, User } from "../types";
import { SessionData } from "express-session";

export function accountRouter() {
  const router = express.Router();

  // GET /login: Render de loginpagina
  router.get("/login", (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("login");
  });

  // POST /login: Verwerk het loginformulier
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Basis validatie
      if (!username || !password) {
        return res.render("login", {
          error: "Vul alle velden in"
        });
      }

      // Gebruik de bestaande login functie
      const user = await login(username, password);

      // Sla gebruiker op in sessie
      if (req.session) {
        req.session.user = {
          _id: user._id,
          username: user.username,
          createdAt: user.createdAt
        };
      }
      req.session.message = {
        type: "success",
        message: "Je bent succesvol ingelogd!"
      };

      // Redirect naar home pagina na succesvolle login
      res.redirect("/");

    } catch (e) {
      const error = e as Error;
      console.error("Login error:", error);

      if (req.session) {
        req.session.message = {
          type: "error",
          message: "Ongeldige gebruikersnaam of wachtwoord"
        };
      }
      res.redirect("/login");
    }
  });

  // GET /logout: Log de gebruiker uit
  router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Logout error:", err);
      res.redirect("/login");
    });
  });

  // POST /update-profile: Update gebruikersgegevens
  router.post("/update-profile", async (req, res) => {
    const { username, password } = req.body;

    // Gebruik de _id van de sessie-gebruiker
    const userId = req.session.user?._id;

    if (!userId) {
      res.status(401).send("Niet ingelogd");
      return;
    }

    try {
      const updatedData: { username?: string; password?: string } = {};

      if (username) {
        updatedData.username = username;
      }
      if (password) {
        updatedData.password = password;
      }

      const updateResult = await updateUser(userId, updatedData);

      if (updateResult) {
        // Update de sessiegegevens na succesvolle update
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
  });

  return router;
}
