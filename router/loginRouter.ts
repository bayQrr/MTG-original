import express, { Router } from "express";
import { login } from "../database";
import { FlashMessage } from "../types";
export const loginRouter = (): Router => {
    const router = Router();

    // Toon login formulier
    router.get("/login", (req, res) => {
        res.render("login", { error: null });
    });

    // Verwerk login
    router.post("/login", async (req, res) => {
        try {
            const { username, password } = req.body;

            // Basis validatie
            if (!username || !password) {
                return res.render("login", {
                    error: "Vul alle velden in"
                });
            }

            // Gebruik de bestaande login functie
            const user = await login(username, password);

            // Sla gebruiker op in sessie
            if (req.session) {
                req.session.user = {
                    _id: user._id,
                    username: user.username,
                    createdAt: user.createdAt
                };
            }

            // Redirect naar home pagina na succesvolle login
            res.redirect("/");

        } catch (e) {
            console.error("Login error:", e);
            res.render("login", {
                error: "Ongeldige gebruikersnaam of wachtwoord"
            });

            req.session.message = {type: "error", message: e.message};
        }
    });

    return router;
};