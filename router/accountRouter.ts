
import express, { Express, Router } from "express";
import dotenv from "dotenv";
import path, { format } from "path";
import { login } from "../database";
import { Collection } from "mongodb";
import { User } from "../types";
import { secureMiddleware } from "../middelware/secureMiddleware";
import { use } from "dev/lib/application";

export default function accountRouter(){
    const router= express.Router();

//login
    router.get("/login", (req, res) => {
        res.render("login");
    });
    
    router.post("/login", async(req, res) => {
        const username : string = req.body.username;
        const password : string = req.body.password;
        try {
            let user : User = await login(username, password);
            delete user.password; 
            req.session.user = user;
            res.redirect("/")
        } catch (e : any) {
            res.redirect("/login");
        }
    });
 
    
//logount

router.get("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

router.post("/logout", secureMiddleware, async (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/login");
    });
});
return router;
}

