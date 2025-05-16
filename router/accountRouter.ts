import express from "express";
import { login } from "../database";


export function accountRouter() {
  const router = express.Router();

  // login pagina renderen
  router.get("/login", ((req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("login");
  }));

  // login pagina verwerken
  router.post("/login", (async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        req.session.message = {
          type: "error",
          message: "Vul alle velden in!"
        };
        res.redirect("/account/login");
        return
      }

      const user = await login(username, password);
      req.session.user = user;
      req.session.message = {
        type: "success",
        message: "Je bent succesvol ingelogd!"
      };

      res.redirect("/");

    } catch (e) {
      req.session.message = {
        type: "error",
        message: "Ongeldige gebruikersnaam of wachtwoord"
      };
      res.redirect("/account/login");
    }
  }));

  // uitloggen
  router.get("/logout", ((req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Logout error:", err);
      res.redirect("/account/login");
    });
  }));

  return router;
}
