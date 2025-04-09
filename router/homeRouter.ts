// router/homeRouter.ts
import express from "express";
import { getCards, getFilteredCards } from "../database";

export function homeRouter() {
  const router = express.Router();

  // router.get("/cards", async (req, res) => {
  //   try {
  //     const allCards = await getCards();

  //     const zoekterm = (req.query.zoekterm as string || "").toLowerCase();
  //     const rarityFilter = req.query.rarity as string || "";

  //     // Filter op kaarten met imageUrl
  //     let filteredCards = allCards.filter(card => card.imageUrl);

  //     // Zoekterm filter (op naam)
  //     if (zoekterm) {
  //       filteredCards = filteredCards.filter(card =>
  //         card.name?.toLowerCase().includes(zoekterm)
  //       );
  //     }

  //     // Rarity filter
  //     if (rarityFilter) {
  //       filteredCards = filteredCards.filter(card =>
  //         card.rarity?.toLowerCase() === rarityFilter.toLowerCase()
  //       );
  //     }

  //     // Verwijder duplicaten op basis van 'name'
  //     const seenNames = new Set<string>();
  //     const uniqueCards = filteredCards.filter(card => {
  //       if (seenNames.has(card.name)) {
  //         return false;
  //       } else {
  //         seenNames.add(card.name);
  //         return true;
  //       }
  //     });

  //     res.json(uniqueCards); // Stuur JSON terug naar client
  //   } catch (error) {
  //     console.error("Fout bij ophalen van kaarten:", error);
  //     res.status(500).send("Er is een fout opgetreden bij het ophalen van de kaarten.");
  //   }
  // });

  router.get("/cards", async (req, res) => {
    try {
      const zoekterm = (req.query.zoekterm as string || "").toLowerCase();
      const rarityFilter = req.query.rarity as string || "";
  
      const filteredCards = await getFilteredCards({
        zoekterm,
        rarity: rarityFilter,
      });
  
      // Als het verzoek komt vanuit de browser (geen fetch), render je HTML
      res.render("index", {
        user: req.session.user,
        cards: filteredCards,
      });
    } catch (error) {
      console.error("Fout bij ophalen van kaarten:", error);
      res.status(500).send("Er is een fout opgetreden bij het ophalen van de kaarten.");
    }
  });
  
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