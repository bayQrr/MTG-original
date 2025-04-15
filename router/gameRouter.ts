import express from "express";
import { ObjectId } from "mongodb";
import { createDeck, getDecksByUser, updateDeck, deleteDeck, parseManaCost } from "../database";
import { Deck, CardInDeck } from "../types";

export function gameRouter() {
    const router = express.Router();


    router.get('/game', async (req, res) => {
        try {
            // Haal de decks op die behoren bij de ingelogde gebruiker.
            // Dit voorkomt dat je decks van andere gebruikers ziet.
            const decks: Deck[] = await getDecksByUser(req.session.user!._id);

            // Render 'game.ejs' en geef de decks mee zodat de dropdown gevuld wordt.
            res.render('game', { decks });
        } catch (error) {
            console.error("Fout bij het ophalen van decks:", error);
            res.status(500).send("Er ging iets mis");
        }
    });



    return router;
}
