import express from "express";
import { login, updateUser } from "../database";
import { User } from "../types";

export function userRouter() {
  const router = express.Router();

  // GET /profile: Toon gebruikersprofiel
router.get("/profile", (req, res) => {
  const user = (req.session as { user?: User }).user;
  if (!user) {
    return res.redirect("/account/login");
  }
  res.render("user", { user });  // Render je user.ejs bestand
});

  // POST /update-profile: Update gebruikersgegevens
  router.post("/update-profile", async (req, res) => {
    const { username, password } = req.body;
    const userId = (req.session as { user?: User }).user?._id;  // Typecast voor zekerheid

    if (!userId) {
      res.status(401).send("Niet ingelogd");
      return;
    }

    try {
     const { username, password, email } = req.body;
const updatedData: { username?: string; password?: string; email?: string } = {};
if (username) updatedData.username = username;
if (password) updatedData.password = password;
if (email) updatedData.email = email;
      // Probeer de gebruiker bij te werken in de database
      const updateResult = await updateUser(userId, updatedData);

      if (updateResult) {
        // Als de gebruikersnaam is bijgewerkt, werk dan de sessie bij
        if (req.session.user && updatedData.username) {
          req.session.user.username = updatedData.username;
        }
        req.session.message = {
          type: "success",
          message: "Je gegevens zijn succesvol bijgewerkt!"
        };
        return res.redirect("/user/profile"); // Redirect naar het profiel na update
      } else {
        res.status(400).send("Er is een fout opgetreden bij het bijwerken.");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Serverfout bij het bijwerken van gebruikersgegevens.");
    }
  });

  return router;
}
