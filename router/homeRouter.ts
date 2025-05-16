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
      const toAdd = parseInt(cardCount, 10) || 1;

      // 1) Pak het deck en de bestaande kaartcount
      const deck = await deckCollection.findOne({ _id: new ObjectId(deckId) });
      const existingEntry = deck?.cards.find(c => c.name === cardId);
      const existingCount = existingEntry?.count ?? 0;

      // 2) Check per-kaart-limiet
      if (existingCount + toAdd > 4) {
        // **Overschrijdt de 4-per-kaart-limiet → blijf op index**
        req.session.message = {
          type: "error",
          message: "Je kunt maximaal 4 van dezelfde kaart in een deck hebben."
        };
        res.redirect("/");
        return
      }

      // 3) Anders: ga door met toevoegen (test op de totaal-limiet in je DB-functie)
      const success = await addCardToDeck(deckId, cardId, toAdd);

      if (!success) {
        // **Alleen mogelijk door de 60-totaal-limiet**
        req.session.message = {
          type: "error",
          message: "Je deck kan maximaal 60 kaarten bevatten."
        };
        res.redirect("/");
        return
      }

      // 4) Bij wél succesvol toevoegen: door naar deck-detail
      return res.redirect(`/deck/${deckId}`);
    } catch (err) {
      console.error("Fout bij toevoegen aan deck:", err);
      res.status(500).send("Server error");
      return
    }
  });


  return router;
}
