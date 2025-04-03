// router/homeRouter.ts
import express from "express";
import { getCards } from "../database";

export function homeRouter() {
  const router = express.Router();
  // duplicatie en filteren van afbeeldingen met een url

  router.get("/cards", async (req, res) => {
    try {
      // Zorg ervoor dat je getCards() als functie aanroept!
      const allCards = await getCards();

      // Filter op alleen kaarten met een imageUrl
      const filteredCards = allCards.filter(card => card.imageUrl);

      // Verwijder duplicaten op basis van de 'name'
      const seenNames = new Set<string>();
      const uniqueCards = filteredCards.filter(card => {
        if (seenNames.has(card.name)) {
          return false;
        } else {
          seenNames.add(card.name);
          return true;
        }
      });

      // Render de pagina met de unieke, gefilterde kaarten
      res.render("index", { cards: uniqueCards });
    } catch (error) {
      console.error("Fout bij ophalen van kaarten:", error);
      res.status(500).send("Er is een fout opgetreden bij het ophalen van de kaarten.");
    }
  });

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
