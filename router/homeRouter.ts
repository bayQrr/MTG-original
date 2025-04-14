import express from "express";
import { getCards } from "../database";

export function homeRouter() {
  const router = express.Router();

  router.get("/cards", async (req, res) => {
    try {
      const zoekterm = (req.query.zoekterm as string || "").toLowerCase();
      const rarityFilter = req.query.rarity as string || "";
      const allCards = await getCards();



      // Begin met alleen kaarten met image
      let filteredCards = allCards.filter(card => card.imageUrl);

      // Zoekterm krijgt prioriteit
      if (zoekterm) {
        filteredCards = filteredCards.filter(card =>
          card.name?.toLowerCase().includes(zoekterm)
        );
      } else if (rarityFilter) {
        filteredCards = filteredCards.filter(card =>
          card.rarity?.toLowerCase() === rarityFilter.toLowerCase()
        );
      }

      // Verwijder dubbele kaarten op naam
      const seenNames = new Set<string>();
      const uniqueCards = filteredCards.filter(card => {
        if (seenNames.has(card.name)) {
          return false;
        } else {
          seenNames.add(card.name);
          return true;
        }
      });

      res.render("index", {
        user: req.session.user,
        cards: uniqueCards,
      });
    } catch (error) {
      console.error("Fout bij ophalen van kaarten:", error);
      res.status(500).send("Er is een fout opgetreden bij het ophalen van de kaarten.");
    }
  });

  // kaart fitere 
  router.get("/", async (req, res) => {
    try {
      if (req.session.user) {
        const allCards = await getCards();

        const filteredCards = allCards.filter(card => card.imageUrl);
        const seenNames = new Set<string>();
        const uniqueCards = filteredCards.filter(card => {
          if (seenNames.has(card.name)) {
            return false;
          } else {
            seenNames.add(card.name);
            return true;
          }
        });

        res.render("index", {
          user: req.session.user,
          cards: uniqueCards,
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).send("Server Error");
    }
  });



  return router;
}