// router/homeRouter.ts
import express from "express";
import { getCards } from "../database";

export function homeRouter() {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      if (req.session.user) {
        const cards = await getCards();
        res.render("index", { user: req.session.user, cards });
      } else {
        // Hier moet je dus naar /login, NIET naar /
        res.redirect("/login");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).send("Server Error");
    }
  });
  

  return router;
}
