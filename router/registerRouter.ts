// registerRouter.ts
import express, { Router } from "express";
import bcrypt from "bcrypt";
import { createUser, userCollectionMTG } from "../database";
import { User } from "../types";

export const registerRouter = (): Router => {
    const router = Router();

    // Toon registratieformulier
    router.get("/register", (req, res) => {
        res.render("register", { error: null });
    });

    // Verwerk registratie
    router.post("/register", async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Basis validatie
            if (!username || !email || !password) {
                return res.render("register", {
                    error: "Alle velden zijn verplicht"
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

            // Gebruik de nieuwe createUser functie
            await createUser({
                username,
                email,
                password: hashedPassword
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
