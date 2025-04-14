import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { createDeck, getDecksByUser, updateDeck, deleteDeck } from "../database";
import { Deck } from "../types";

import session from "../session"
import { secureMiddleware } from "../middelware/secureMiddleware";

export function deckRouter() {
  // Initialiseer de router
  const router = express.Router();

  // Route om alle decks van een gebruiker op te halen
  router.get("/deck", async (req, res) => {
    try {
      // Haal de decks van de ingelogde gebruiker op uit req.session.user
      const userId = req.session.user!._id; // Gebruiker info wordt opgeslagen in req.session.user
      const decks = await getDecksByUser(userId);
      res.render("deck", { decks }); // Render de view 'deck.ejs' en stuur de decks mee
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het ophalen van de decks.");
    }
  });

  // Route voor het aanmaken van een nieuw deck
  router.post("/create-deck", async (req, res) => {
    try {
      const { deckName, deckImageUrl } = req.body;
  
      // Maak een nieuw deck object
      const newDeck: Deck = {
        name: deckName,
        imageUrl: deckImageUrl,
        userId: req.session.user!._id, // Gebruik de ingelogde gebruiker uit req.session.user
        cards: [] // Voeg een lege kaarten array toe
      };
  
      // Creëer het deck in de database
      await createDeck(newDeck);
  
      // Redirect naar de lijst van decks
      res.redirect("/deck");
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het aanmaken van het deck.");
    }
  });

  // Route om een deck te bewerken (laat de huidige gegevens zien)
  router.get("/edit-deck/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);
      const decks = await getDecksByUser(req.session.user!._id); // Haal de decks op van de ingelogde gebruiker uit req.session.user
      const deckToEdit = decks.find(d => d._id.toString() === deckId.toString());



      res.render("edit-deck", { deck: deckToEdit });
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het ophalen van het deck.");
    }
  });

  // Route om een deck bij te werken
  router.post("/edit-deck/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);
      const { deckName, deckImageUrl } = req.body;

      const updatedDeck: Partial<Deck> = {
        name: deckName,
        imageUrl: deckImageUrl
      };

      // Update het deck in de database
      await updateDeck(deckId, updatedDeck);

      // Redirect naar de lijst van decks
      res.redirect("/deck");
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het bijwerken van het deck.");
    }
  });

  // Route om een deck te verwijderen
  router.post("/delete-deck/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);

      // Verwijder het deck uit de database
      await deleteDeck(deckId);

      // Redirect naar de lijst van decks
      res.redirect("/deck");
    } catch (error) {
      res.status(500).send("Er is iets mis gegaan bij het verwijderen van het deck.");
    }
  });


  //route om naar deckview te gaan
  router.get("/deckview/:id", async (req, res) => {
    try {
      const deckId = new ObjectId(req.params.id);
      const decks = await getDecksByUser(req.session.user!._id);
      const selectedDeck = decks.find(deck => deck._id.toString() === deckId.toString());

      if (!selectedDeck) {
        res.status(404).send("Deck niet gevonden.");
      }


      res.render("deckview", { deck: selectedDeck });
    } catch (error) {
      res.status(500).send("Fout bij het laden van de deckweergave.");
    }
  });


  return router;

}