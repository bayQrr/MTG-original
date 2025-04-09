// router/accountRouter.ts
import express from "express";
import { login } from "../database";

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
      const user = await login(username, password);
      req.session.user = user; // Sla de user op in de sessie
      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      res.redirect("/login?error=invalid");
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
