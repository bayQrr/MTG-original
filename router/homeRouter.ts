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
    // Haal de gegevens uit het formulier
    const { deckId, cardName, cardCount } = req.body;

    // Log de ontvangen gegevens voor debugging
    console.log("Ontvangen gegevens:", req.body);

    // Controleer of de deckId geldig is
    if (!ObjectId.isValid(deckId)) {
       res.status(400).send("Ongeldig deckId");
    }

    // Zet de cardCount om naar een getal, default naar 1 als geen waarde is opgegeven
    const count = parseInt(cardCount, 10) || 1;

    // Zoek het deck op in de database
    const deck = await deckCollection.findOne({ _id: new ObjectId(deckId) });

    // Controleer of het deck bestaat
    if (!deck) {
       res.status(404).send("Deck niet gevonden");
    }

    // Log de deck-gegevens voor debugging
    console.log("Gevonden deck:", deck);

   
    // Controleer of de kaart al bestaat in het deck
    const bestaandeKaart = deck?.cards.find(card => card.name === cardName);

    if (bestaandeKaart) {
      // Kaart bestaat al, verhoog de hoeveelheid
      console.log(`Kaart bestaat al, verhoog de hoeveelheid: ${cardName}`);
      await deckCollection.updateOne(
        { _id: new ObjectId(deckId), "cards.name": cardName },
        { $inc: { "cards.$.count": count } }
      );
    } else {
      // Nieuwe kaart toevoegen aan het deck
      console.log(`Nieuwe kaart toevoegen: ${cardName}`);
      await deckCollection.updateOne(
        { _id: new ObjectId(deckId) },
        { $push: { cards: { name: cardName, count } } }
      );
    }

    // Redirect naar de deck-pagina of een andere pagina
    res.redirect("/deck"); // Zorg ervoor dat deze pagina correct bestaat

  } catch (err) {
    console.error("Fout bij toevoegen aan deck:", err);
    res.status(500).send("Server error");
  }
});


  return router;
}