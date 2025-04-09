import express from "express";

export function userRouter() {
    const router = express.Router();

    router.get("/user", (req, res) => {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        res.render("user", {
            user: req.session.user,
        });
    });

    return router;
}
