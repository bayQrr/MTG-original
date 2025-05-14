import express from "express";
import { login, updateUser } from "../database";

export function accountRouter() {
  const router = express.Router();

  // GET /login: Render de loginpagina
  router.get("/login", (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("login");  // ✅
  });

  // POST /login: Verwerk het loginformulier
  router.post("/login", async (req, res) => {
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

      req.session.user = {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt
      };
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
      res.redirect("/account/login");  // ✅
    }
  });

  // GET /logout: Log de gebruiker uit
  router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Logout error:", err);
      res.redirect("/account/login");  // ✅
    });
  });

  // POST /update-profile: Update gebruikersgegevens
  // router.post("/update-profile", async (req, res) => {
  //   const { username, password } = req.body;
  //   const userId = req.session.user?._id;

  //   if (!userId) {
  //     res.status(401).send("Niet ingelogd");
  //     return
  //   }

  //   try {
  //     const updatedData: { username?: string; password?: string } = {};
  //     if (username) updatedData.username = username;
  //     if (password) updatedData.password = password;

  //     const updateResult = await updateUser(userId, updatedData);

  //     if (updateResult) {
  //       if (req.session.user && updatedData.username) {
  //         req.session.user.username = updatedData.username;
  //       }
  //       req.session.message = {
  //         type: "success",
  //         message: "Je gegevens zijn succesvol bijgewerkt!",
  //       };
  //       return res.redirect("/");
  //     } else {
  //       res.status(400).send("Er is een fout opgetreden bij het bijwerken.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Serverfout bij het bijwerken van gebruikersgegevens.");
  //   }
  // });

  return router;
}
