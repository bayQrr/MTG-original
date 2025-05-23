import { NextFunction, Request, Response } from "express";

export function flashMiddleware(req: Request, res: Response, next: NextFunction) {
    // Flash messages , tonen van meldingen
    if (req.session.message) {
        res.locals.message = req.session.message;
        delete req.session.message;//meding verwijderen ,zodat maar 1 keer tonen
    } else {
        res.locals.message = undefined;
    }

    // User informatie
    res.locals.user = req.session.user || null;

    next();
}