
import express, { Request, Response, Router, RequestHandler } from "express";
import { secureMiddleware } from "../middelware/secureMiddleware";

export function userRouter(): Router {
  const router = express.Router();





// User pagina route
router.get("/", secureMiddleware, (req: Request, res: Response) => {
  res.render("user", {
    user: req.session.user
  });
});




  return router;
}
