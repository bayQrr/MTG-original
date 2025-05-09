import express from "express";
import { ObjectId } from "mongodb";
import { createDeck, getDecksByUser, updateDeck, deleteDeck, parseManaCost } from "../database";
import { Deck, CardInDeck } from "../types";

export function drawtestRouter() {
    const router = express.Router();

    router.get("/drawtest", async (req, res) => {
        try {
            const userId = req.session.user!._id;
            const decks: Deck[] = await getDecksByUser(userId);

            const selectedDeckId = req.query.deckId as string;
            let selectedDeckCards: CardInDeck[] = [];

            if (selectedDeckId && ObjectId.isValid(selectedDeckId)) {
                const selectedDeck = decks.find(d => d._id?.toString() === selectedDeckId);
                if (selectedDeck) {
                    selectedDeckCards = selectedDeck.cards;
                }
            }

            res.render("drawtest", {
                decks,
                selectedDeckId,
                cards: selectedDeckCards,
            });
        } catch (err) {
            console.error("Fout bij ophalen van drawtest gegevens:", err);
            res.status(500).send("Server error");
        }
    });



    router.get("/api/deck/:id", async (req, res) => {
        try {
            const deckId = req.params.id;
            if (!ObjectId.isValid(deckId)) {
                res.status(400).send("Ongeldig ID");
                return
            }

            const decks = await getDecksByUser(req.session.user!._id);
            const selectedDeck = decks.find(d => d._id.toString() === deckId);

            if (!selectedDeck) {
                res.status(404).send("Deck niet gevonden");
                return;
            }

            res.json(selectedDeck.cards);
        } catch (err) {
            console.error("Fout bij ophalen deck:", err);
            res.status(500).send("Serverfout");
        }
    });

    router.get("/api/deck/:id/search", async (req, res) => {
        try {
            const deckId = req.params.id;
            const term = (req.query.term as string || "").toLowerCase();

            if (!ObjectId.isValid(deckId)) {
                res.status(400).send("Ongeldige deck ID");
                return;
            }

            const decks = await getDecksByUser(req.session.user!._id);
            const selectedDeck = decks.find(d => d._id.toString() === deckId);
            if (!selectedDeck) {
                res.status(404).send("Deck niet gevonden");
                return;
            }

            const total = selectedDeck.cards.reduce((acc, c) => acc + (c.count || 1), 0);
            const matches = selectedDeck.cards
                .filter(card => card.name.toLowerCase().includes(term))
                .reduce((acc, c) => acc + (c.count || 1), 0);

            const kans = total > 0 ? (matches / total) * 100 : 0;

            res.json({
                totaalKaarten: total,
                matches,
                kans: kans.toFixed(2)
            });
        } catch (err) {
            console.error("Fout bij kans berekening:", err);
            res.status(500).send("Server error");
        }
    });

    return router;
}
