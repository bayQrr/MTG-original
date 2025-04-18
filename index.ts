// index.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect } from "./database";
import session from "./session"; // Zorg dat je session.ts correct is ingesteld
import { accountRouter } from "./router/accountRouter";
import { homeRouter } from "./router/homeRouter";
import { userRouter } from "./router/userRouter";

dotenv.config();

const app: Express = express();

// Stel EJS als view engine in en definieer de views-map
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session); // Zorg dat sessie-middleware vóór de routers komt

// Routers
app.use(accountRouter());
app.use("/", homeRouter());
app.use(userRouter());

app.set("port", process.env.PORT || 3000);

app.get('/deck', (req, res) => {
  res.render('deck'); // zorgt voor weergave van views/deck.ejs
});
app.get("/", (req, res) => {
  res.render("index");
});

// Route naar de drawtest pagina
app.get('/game', (req, res) => {
  res.render('game'); // zorgt voor weergave van views/game.ejs
});
app.listen(app.get("port"), async () => {
  try {
    await connect();
    console.log(`Server started on http://localhost:${app.get("port")}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
});