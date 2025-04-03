import express, { Express } from "express";
import dotenv from "dotenv";
import path, { format } from "path";
import { connect } from "./database";
import session from "./session";
import accountRouter from "./router/accountRouter";
import { homeRouter } from "./router/homeRouter";
import { secureMiddleware } from "./middelware/secureMiddleware";
dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session);
connect();
app.use(accountRouter());
app.use(homeRouter());

app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

// app.get("/" ,secureMiddleware, async(req, res) => {
//     res.render("index");
// });

app.get("/", async(req, res) => {
    if (req.session.user) {
        res.render("index", {user: req.session.user});
    } else {
        res.redirect("/login");
    }
});



app.listen(app.get("port"),async () => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (e) {
        console.log(e);
        process.exit(1); 
    }
});