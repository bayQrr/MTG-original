// router/accountRouter.ts
import express from "express";
import { login } from "../database";
import { FlashMessage } from "../types";

export function accountRouter() {
  const router = express.Router();

  // GET /login: Render de loginpagina
  router.get("/login", (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("login");
  });

  //get
  //   router.get("/login", (req, res) => {
  //     res.render("login");
  // });



  // POST /login: Verwerk het loginformulier
  // router.post("/login", async (req, res) => {
  //   try {
  //     const { username, password } = req.body;
  //     const user = await login(username, password);
  //     req.session.user = user; // Sla de user op in de sessie
  //     res.redirect("/");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     res.redirect("/login?error=invalid");
  //   }
  // });
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
      // console.error("Login error:", error);

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

  return router;
}
