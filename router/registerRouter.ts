import express, { Router } from "express";
import bcrypt from "bcrypt";
import { userCollectionMTG } from "../database";

// Definieer de User interface
interface User {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

export const registerRouter = (): Router => {
    const router = Router();

    // Toon registratieformulier
    router.get("/register", (req, res) => {
        res.render("register", { error: null });
    });

    // Verwerk registratie
    router.post("/register", async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body;

            // Basis validatie
            if (!username || !email || !password || !confirmPassword) {
                return res.render("register", {
                    error: "Alle velden zijn verplicht"
                });
            }

            if (password !== confirmPassword) {
                return res.render("register", {
                    error: "Wachtwoorden komen niet overeen"
                });
            }

            // Controleer of gebruiker al bestaat
            const existingUser = await userCollectionMTG.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            });

            if (existingUser) {
                return res.render("register", {
                    error: "Gebruikersnaam of email is al in gebruik"
                });
            }

            // Hash het wachtwoord
            const hashedPassword = await bcrypt.hash(password, 10);

            // Maak nieuwe gebruiker aan
            await userCollectionMTG.insertOne({
                username,
                email,
                password: hashedPassword,
                createdAt: new Date()
            });

            // Redirect naar login na succesvolle registratie
            res.redirect("/login");

        } catch (error) {
            console.error("Registratie error:", error);
            res.render("register", {
                error: "Er is een fout opgetreden bij het registreren"
            });
        }
    });

    return router;
}; 