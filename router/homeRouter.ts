import express from "express";
import { getCards ,addCardToDeck,getDecksByUser,deckCollection} from "../database";
import  {ObjectId } from "mongodb";

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

        const userDecks = await getDecksByUser(req.session.user._id);
        res.render("index", {
          user: req.session.user,
          cards: uniqueCards,
          decks: userDecks,
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).send("Server Error");
    }
  });




// Route voor het toevoegen van een kaart aan een deck
// Route voor het toevoegen van een kaart aan een deck
router.post("/add-to-deck", async (req, res) => {
  try {
    const { deckId, cardName, cardCount } = req.body;

    // Zorg ervoor dat de cardCount een getal is
    const count = parseInt(cardCount, 10) || 1; // Standaard op 1 als geen geldige count is gegeven

    // Controleer of het deckId een geldig ObjectId is
    if (!ObjectId.isValid(deckId)) {
       res.status(400).send("Ongeldig deckId");
    }

    // Werk het deck bij
    const deck = await deckCollection.findOne({ _id: new ObjectId(deckId) });

    // Controleer of het deck bestaat (null check)
    if (!deck) {
       res.status(404).send("Deck niet gevonden");
    }

    // Kijk of de kaart al bestaat in het deck
    const cardIndex = deck?.cards.findIndex(card => card.name === cardName);

    if (cardIndex !== -1) {
      // Als de kaart al bestaat, werk dan het aantal bij
      await deckCollection.updateOne(
        { _id: new ObjectId(deckId), "cards.name": cardName },
        { $inc: { "cards.$.count": count } }
      );
    } else {
      // Als de kaart nog niet in het deck zit, voeg deze toe met count
      await deckCollection.updateOne(
        { _id: new ObjectId(deckId) },
        { $push: { cards: { name: cardName, count: count } } }
      );
    }

    // Redirect naar het deck-overzicht
    res.redirect("/deck");
  } catch (error) {
    console.error("Error adding card to deck:", error);
    res.status(500).send("Er is iets mis gegaan bij het toevoegen van de kaart.");
  }
});



  return router;
}