import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCards, getDecksByUser, deckCollection, addCardToDeck } from "../database";
import { Deck, Cards, CardInDeck } from "../types";

export function homeRouter() {
  const router = express.Router();

  //  Route voor zoeken/filteren kaarten
  router.get("/cards", async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/login");

      const zoekterm = (req.query.zoekterm as string || "").toLowerCase();
      const rarityFilter = req.query.rarity as string || "";
      const allCards: Cards[] = await getCards();

      let filteredCards = allCards.filter(card => card.imageUrl);

      if (zoekterm) {
        filteredCards = filteredCards.filter(card =>
          card.name?.toLowerCase().includes(zoekterm)
        );
      } else if (rarityFilter) {
        filteredCards = filteredCards.filter(card =>
          card.rarity?.toLowerCase() === rarityFilter.toLowerCase()
        );
      }

      const seenNames = new Set<string>();
      const uniqueCards = filteredCards.filter(card => {
        if (seenNames.has(card.name)) return false;
        seenNames.add(card.name);
        return true;
      });

      // ✅ Decks ophalen en meesturen
      const userDecks: Deck[] = await getDecksByUser(req.session.user._id);

      res.render("index", {
        user: req.session.user,
        cards: uniqueCards,
        decks: userDecks,
      });
    } catch (error) {
      console.error("Fout bij ophalen van kaarten:", error);
      res.status(500).send("Fout bij het ophalen van kaarten.");
    }
  });


  // Index route (alle kaarten + decks van user)
  router.get("/", async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/landing");

      const allCards: Cards[] = await getCards();
      const filteredCards = allCards.filter(card => card.imageUrl);
      const seenNames = new Set<string>();

      const uniqueCards = filteredCards.filter(card => {
        if (seenNames.has(card.name)) return false;
        seenNames.add(card.name);
        return true;
      });

      const userDecks: Deck[] = await getDecksByUser(req.session.user._id);

      res.render("index", {
        user: req.session.user,
        cards: uniqueCards,
        decks: userDecks,
      });
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).send("Server Error");
    }
  });

  // Kaart toevoegen aan een deck
  router.post("/add-to-deck", async (req, res) => {
    try {
      const { deckId, cardId, cardCount } = req.body;

      if (!ObjectId.isValid(deckId) || !ObjectId.isValid(cardId)) {
        res.status(400).send("Ongeldig deckId of cardId");
        return;
      }

      const success = await addCardToDeck(deckId, cardId, parseInt(cardCount, 10) || 1);

      if (!success) {
        // Stuur een flash-melding mee bij te veel kaarten
        req.session.message = {
          type: "error",
          message: "Je deck kan max 60 kaarten nemen. Je kunt geen extra kaarten toevoegen.",
        };
        res.redirect("/");
        return;
      }

      return res.redirect(`/deckview/${deckId}`);
    } catch (err) {
      console.error("Fout bij toevoegen aan deck:", err);
      res.status(500).send("Server error");
    }
  });


  return router;
}
