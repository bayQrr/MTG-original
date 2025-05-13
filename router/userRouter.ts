import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// Middleware om te controleren of gebruiker is ingelogd
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/account/login");
  }
};

// User pagina route
router.get("/", isAuthenticated, (req: Request, res: Response) => {
  res.render("user", {
    user: req.session.user
  });
});




export const userRouter = () => router;
