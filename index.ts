import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect } from "./database";
import session from "./session";
import { accountRouter } from "./router/accountRouter";
import { homeRouter } from "./router/homeRouter";
import { userRouter } from "./router/userRouter";
import { registerRouter } from "./router/registerRouter";
import { deckRouter } from "./router/deckRouter";
import { drawtestRouter } from "./router/drawtestRouter";
import { flashMiddleware } from "./middelware/flashMiddleware";

dotenv.config();

const app: Express = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session);
app.use(flashMiddleware);

// routers
app.use("/", homeRouter());
app.use("/account", accountRouter());
app.use("/user", userRouter());
app.use(registerRouter());
app.use("/deck", deckRouter());
app.use("/drawtest", drawtestRouter());

app.get("/landing", (req, res) => {
  res.render("landing");
});

app.get('/drawtest', (req, res) => {
  res.render('drawtest');
});

app.get("/login", (req, res) => {
  res.redirect("/account/login");
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), async () => {
  try {
    await connect();
    console.log(`Server gestart op http://localhost:${app.get("port")}`);
  } catch (error) {
    console.error("Error bij verbinden met database:", error);
    process.exit(1);
  }
});
