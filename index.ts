
import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect } from "./database";
import session from "./session"; // Zorg dat je session.ts correct is ingesteld
import { accountRouter } from "./router/accountRouter";
import { homeRouter } from "./router/homeRouter";
import { userRouter } from "./router/userRouter";
import { registerRouter } from "./router/registerRouter";
import { deckRouter } from "./router/deckRouter";
import { drawtestRouter } from "./router/drawtestRouter";
import { flashMiddleware } from "./middelware/flashMiddleware";

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
app.use(flashMiddleware);

// Routers
app.use(accountRouter());
app.use("/", homeRouter());
app.use(userRouter());
app.use(registerRouter());
app.use("/", deckRouter());
app.use(drawtestRouter());


app.set("port", process.env.PORT || 3000);


//routes die je brengen naar de gevraagde pagina's
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/landing", (req, res) => {
  res.render("landing");
});

app.get('/deck', (req, res) => {
  res.render('deck');
});

app.get('/deckview', (req, res) => {
  res.render('deckview');
});

app.get('/drawtest', (req, res) => {
  res.render('drawtest');
});

app.listen(app.get("port"), async () => {
  try {
    await connect();
    console.log(`Server gestart op http://localhost:${app.get("port")}`);
  } catch (error) {
    console.error("Error bij verbinden met database:", error);
    process.exit(1);
  }
});

/*testtttttt*/
/*eeeeee*/