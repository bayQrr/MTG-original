// registerRouter.ts
import express from "express";
import bcrypt from "bcrypt";
import { createUser, userCollectionMTG } from "../database";


export function registerRouter() {
    const router = express.Router();


    // register renderen
    router.get("/register", (req, res) => {
        res.render("register", { error: null });
    });

    // register pagina verwerken
    router.post("/register", async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // checkt of alles is ingevuld
            if (!username || !email || !password) {
                return res.render("register", {
                    error: "Alle velden zijn verplicht"
                });
            }

            // checkt of de gebruiker al bestaat
            const existingUser = await userCollectionMTG.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            });

            if (existingUser) {
                req.session.message = {
                    type: "error",
                    message: "Gebruikersnaam of email is al in gebruik"
                };
                return res.redirect("/register");
            }

            // wachtwoord hashen
            const hashedPassword = await bcrypt.hash(password, 10);

            //createUser functie
            await createUser({
                username,
                email,
                password: hashedPassword
            });
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
