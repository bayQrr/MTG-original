
import express from "express";
import { secureMiddleware } from "../middelware/secureMiddleware";
import { login, updateUser, userCollectionMTG } from "../database";
import { User } from "../types";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export function userRouter() {
  const router = express.Router();


  router.get("/", secureMiddleware, (req, res) => {
    res.render("user", {
      user: req.session.user
    });
  });
// profule updaten
  router.post("/update-profile", async (req, res) => {
    const userId = req.session.user?._id;
    if (!userId) {
      return res.status(401).redirect("/account/login");
    }

    try {
      const { username, email } = req.body;
      const updatedData: any = {};
      if (username) updatedData.username = username;
      if (email) updatedData.email = email;

      const ok = await updateUser(new ObjectId(userId), updatedData);//updateuqer uit db.ts funtie gehaald
    

      // update sessie
      if (req.session.user) {
        if (updatedData.username) req.session.user.username = updatedData.username;
        if (updatedData.email) req.session.user.email = updatedData.email;
      }
      req.session.message = {
        type: "success",
        message: "Je gegevens zijn succesvol bijgewerkt!"
      };
      return res.redirect("/user");
    } catch (err) {
      console.error("Error update-profile:", err);
      req.session.message = {
        type: "error",
        message: "Er is een fout opgetreden bij het bijwerken van je account"
      };
      return res.redirect("/user");
    }
  });

  // profielfoto veranderen
  router.get("/change-profile", secureMiddleware, (req, res) => {
    res.render("change-profile", {
      user: req.session.user,
      message: req.session.message || null,
    });
  });


  router.post("/update-profile-image", secureMiddleware, async (req, res) => {
    const userId = req.session.user?._id;
    const { imageUrl } = req.body;
    if (!userId || !imageUrl) {
      req.session.message = { type: "error", message: "Ongeldige aanvraag." };
      return res.redirect("/user/change-profile");
    }
    try {
      await userCollectionMTG.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { profileImage: imageUrl } }
      );
      req.session.user!.profileImage = imageUrl;
      req.session.message = {
        type: "success",
        message: "Profielfoto bijgewerkt!",
      };
      res.redirect("/user");
    } catch (err) {
      console.error(err);
      req.session.message = {
        type: "error",
        message: "Fout bij het bijwerken van de profielfoto.",
      };
      res.redirect("/user/change-profile");
    }
  }
  );

  // wachtwoord veranderen
  router.post("/update-password", async (req, res) => {
    try {
      const userId = req.session.user?._id;
      if (!userId) {
        res.redirect("/account/login");
        return
      }

      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = await userCollectionMTG.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        res.redirect("/account/login");
        return
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        req.session.message = { type: "error", message: "Huidig wachtwoord is incorrect" };
        res.redirect("/user");
        return
      }
      if (newPassword !== confirmPassword) {
        req.session.message = { type: "error", message: "Nieuwe wachtwoorden komen niet overeen" };
        res.redirect("/user");
        return
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateResult = await userCollectionMTG.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
      if (updateResult.modifiedCount === 0) {
        req.session.message = { type: "error", message: "Wachtwoord kon niet worden bijgewerkt" };
        res.redirect("/user");
        return
      }

      // bij succes vernietig de sessie en stuur naar login
      req.session.destroy(err => {
        if (err) {
          console.error("Fout bij vernietigen sessie:", err);
          res.redirect("/account/login");
          return
        }
        res.redirect("/account/login");
      });

    } catch (e) {
      console.error(e);
      req.session.message = { type: "error", message: "Er is een fout opgetreden bij het wijzigen van het wachtwoord" };
      res.redirect("/user");
      return
    }
  });


  // account verwijderen
  router.post("/delete", async (req, res) => {
    try {
      const userId = req.session.user?._id;
      const { deleteConfirm } = req.body;

      if (!userId) {
        res.redirect("/account/login");
        return
      }

      if (deleteConfirm !== "VERWIJDER") {
        req.session.message = {
          type: "error",
          message: "Je moet 'VERWIJDER' typen om je account te verwijderen"
        };
        return res.redirect("/user");
      }

      // verwijdert de gebruiker uit de collection
      const deleteResult = await userCollectionMTG.deleteOne({ _id: new ObjectId(userId) });

      if (!deleteResult.deletedCount) {
        req.session.message = {
          type: "error",
          message: "Er is een fout opgetreden bij het wijzigen van je account"
        };
        res.redirect("/user");
        return
      }

      // de sessie vernietigen
      req.session.destroy((err) => {
        if (err) {
          console.error("Fout bij vernietigen sessie:", err);
          res.redirect("/acount/login");
          return
        }
        res.redirect("/account/login");
      });

    } catch (e) {
      req.session.message = {
        type: "error",
        message: "Er is een fout opgetreden bij het verwijderen van je account"
      };
      res.redirect("/user");
    }
  });

  return router;
}
