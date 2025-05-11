import express from "express";
import { ObjectId } from "mongodb";
import { createDeck, getDecksByUser, updateDeck, deleteDeck, parseManaCost, removeCardFromDeck, deckCollection } from "../database";
import { Deck, CardInDeck } from "../types";

export function deckRouter() {
  const router = express.Router();

  // Haal alle decks op van een gebruiker
  router.get("/", async (req, res) => {
    try {
      const userId = req.session.user!._id;
      const decks: Deck[] = await getDecksByUser(userId);
      res.render("deck", { decks });
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het ophalen van de decks.");
    }
  });

  // Maak een nieuw deck aan
  router.post("/create-deck", async (req, res) => {
    try {
      const { deckName, deckImageUrl } = req.body;

      // Validatie
      if (!deckName || !deckImageUrl) {
        req.session.message = {
          type: "error",
          message: "Vul alle velden in"
        };
        return res.redirect("/deck");
      }

      if (deckName.length < 3) {
        req.session.message = {
          type: "error",
          message: "Deck naam moet minimaal 3 karakters lang zijn"
        };
        return res.redirect("/deck");
      }

      // Controleer of gebruiker is ingelogd
      if (!req.session.user?._id) {
        req.session.message = {
          type: "error",
          message: "Je moet ingelogd zijn om een deck aan te maken"
        };
        return res.redirect("/account/login");
      }

      const newDeck: Deck = {
        name: deckName,
        imageUrl: deckImageUrl,
        userId: req.session.user._id,
        cards: []
      };

      const result = await createDeck(newDeck);

      if (!result.acknowledged) {
        req.session.message = {
          type: "error",
          message: "Er is een fout opgetreden bij het aanmaken van het deck"
        };
        return res.redirect("/deck");
      }

      req.session.message = {
        type: "success",
        message: "Deck succesvol aangemaakt!"
      };
      res.redirect("/deck");
    } catch (error) {
      console.error("Fout bij aanmaken deck:", error);
      req.session.message = {
        type: "error",
        message: "Er is een fout opgetreden bij het aanmaken van het deck"
      };
      res.redirect("/deck");
    }
  });

  // Bewerken van een deck
  router.post("/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);
      const { deckName, deckImageUrl } = req.body;

      const updatedDeck: Partial<Deck> = {
        name: deckName,
        imageUrl: deckImageUrl
      };

      await updateDeck(deckId, updatedDeck);
      res.redirect("/deck");
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het bijwerken van het deck.");
    }
  });

  // Verwijder een deck
  router.post("/delete-deck/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);
      await deleteDeck(deckId);
      res.redirect("/deck");
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het verwijderen van het deck.");
    }
  });

  // Bekijk een specifiek deck
  router.get("/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);
      const decks: Deck[] = await getDecksByUser(req.session.user!._id);
      const selectedDeck = decks.find(deck => deck._id?.toString() === deckId.toString());

      if (!selectedDeck) {
        res.status(404).send("Deck niet gevonden.");
        return;
      }

      // Haal de kaarten op (CardInDeck array)
      const kaartenInDeck: CardInDeck[] = selectedDeck.cards || [];

      // Bereken totaal aantal kaarten
      const aantalKaarten = kaartenInDeck.reduce((acc, card) => acc + (card.count || 0), 0);

      // Bereken aantal landkaarten (controleer 'card.type' op 'land', case-insensitive)
      const aantalLandkaarten = kaartenInDeck
        .filter(card => card.type && card.type.toLowerCase().includes("land"))
        .reduce((acc, card) => acc + (card.count || 0), 0);

      // Bereken totale mana uit de manaCost-string.
      // We gaan ervan uit dat elk card een 'manaCost' veld bevat, 
      // bijvoorbeeld uit de originele Cards data.
      const mana = kaartenInDeck.reduce((acc, card) => {
        // Gebruik 'card.manaCost' als die bestaat, anders een lege string.
        // (Typecasting: als je CardInDeck nog geen manaCost heeft, kun je 
        //  even casten naar any om de property te lezen.)
        const costStr = (card as any).manaCost || "";
        return acc + parseManaCost(costStr) * (card.count || 1);
      }, 0);

      res.render("deckview", {
        deck: selectedDeck,
        decks,
        kaartenInDeck,
        aantalKaarten,
        aantalLandkaarten,
        mana
      });
    } catch (error) {
      res.status(500).send("Fout bij het laden van de deckweergave.");
    }
  });

  // mogelijkheid om kaart verwijderen in deckview
  router.post("/:id/removeCard", async (req, res) => {
    const { cardName, count } = req.body;
    const deckId = req.params.id;

    const aantal = parseInt(count);
    if (!cardName || isNaN(aantal) || aantal < 1) {
      res.status(400).send("Ongeldige gegevens");
      return;
    }

    await removeCardFromDeck(deckId, cardName, aantal);
    res.redirect(`/deck/${deckId}`); // terug naar de deckview
  });

  router.get('/:id/export', async (req, res) => {
    const deckId = req.params.id;

    try {
      const deck = await deckCollection.findOne({ _id: new ObjectId(deckId) });

      if (!deck) {
        res.status(404).send("Deck niet gevonden");
        return
      }

      // Hier zetten we headers
      res.setHeader('Content-Type', 'application/json');
      res.send(deck.cards);
    } catch (error) {
      console.error(error);
      res.status(500).send("Fout bij exporteren van deck");
    }
  });

  return router;
}
