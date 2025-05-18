import express from "express";
import { ObjectId } from "mongodb";
import { createDeck, getDecksByUser, updateDeck, deleteDeck, parseManaCost, removeCardFromDeck, deckCollection } from "../database";
import { Deck, CardInDeck } from "../types";

export function deckRouter() {
  const router = express.Router();

  // haalt alle decks op van de gebruiker
  router.get("/", async (req, res) => {
    try {
      const userId = req.session.user!._id;
      const decks: Deck[] = await getDecksByUser(userId);
      res.render("deck", { decks });
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het ophalen van de decks.");
    }
  });

  // maakt een nieuwe deck aan
  router.post("/create-deck", async (req, res) => {
    try {
      const { deckName, deckImageUrl } = req.body;

      // checken
      if (!deckName || !deckImageUrl) {
        req.session.message = {
          type: "error",
          message: "Vul alle velden in"
        };
        return res.redirect("/deck");
      }


      // checkt of de gebruiker is ingelogd
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


 // deck kunnen bewerken
router.post("/:id", async (req, res) => {
  try {
    const deckId = new ObjectId(req.params.id);
    const { deckName, deckImageUrl } = req.body;

    const updatedDeck: Partial<Deck> = {
      name: deckName,
      imageUrl: deckImageUrl
    };

    await updateDeck(deckId, updatedDeck);

    req.session.message = {
      type: "success",
      message: "Deck succesvol bijgewerkt!"
    };

    res.redirect("/deck");
  } catch (error) {
    req.session.message = {
      type: "error",
      message: "Er is iets mis gegaan bij het bijwerken van het deck."
    };
    res.redirect("/deck");
  }
});



  // een specifiek deck bekijken
  router.get("/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);
      const decks: Deck[] = await getDecksByUser(req.session.user!._id);
      const selectedDeck = decks.find(deck => deck._id?.toString() === deckId.toString());

      if (!selectedDeck) {
        res.status(404).send("Deck niet gevonden.");
        return;
      }
      const kaartenInDeck: CardInDeck[] = selectedDeck.cards || [];

      // berekent het aantal kaarten
      const aantalKaarten = kaartenInDeck.reduce((acc, card) => acc + (card.count || 0), 0);

      // berekent het aantal landt kaarten en checkt ze
      const aantalLandkaarten = kaartenInDeck
        .filter(card => card.type && card.type.toLowerCase().includes("land"))
        .reduce((acc, card) => acc + (card.count || 0), 0);

      // manacost berekenen
      const mana = kaartenInDeck.reduce((acc, card) => {
        const costStr = (card as any).manaCost || "";
        return acc + parseManaCost(costStr) * (card.count || 1);
      }, 0);

      res.render("deckview", {
        user: req.session.user,
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

  // deck verwijderen

router.post("/delete-deck/:id", async (req, res) => {
  try {
    const deckId = new ObjectId(req.params.id);
    await deleteDeck(deckId);

    req.session.message = {
      type: "success",
      message: "Deck succesvol verwijderd!"
    };

    res.redirect("/deck");
  } catch (error) {
    req.session.message = {
      type: "error",
      message: "Er is iets mis gegaan bij het verwijderen van het deck."
    };

    res.redirect("/deck");
  }
});


  router.get('/:id/export', async (req, res) => {
    const deckId = req.params.id;

    try {
      const deck = await deckCollection.findOne({ _id: new ObjectId(deckId) });

      if (!deck) {
        res.status(404).send("Deck niet gevonden");
        return
      }

      // we maken document aan om te kunnen exporteren
      res.setHeader('Content-Type', 'application/json');
      res.send(deck.cards);
    } catch (error) {
      console.error(error);
      res.status(500).send("Fout bij exporteren van deck");
    }
  });

  return router;
}
