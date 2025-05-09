    import { MONGODB_URI } from "./database";
    import session, { MemoryStore } from "express-session";
    import { User } from "./types";
    import mongoDbSession from "connect-mongodb-session";
    import { FlashMessage } from "./types";
    const MongoDBStore = mongoDbSession(session);

    const mongoStore = new MongoDBStore({
        uri: MONGODB_URI,
        collection: "sessions",
        databaseName: "MTGdb",
    });

    declare module 'express-session' {
        export interface SessionData {
            user?: User;
            message?: FlashMessage;
        }
    }


    export default session({
        secret: process.env.SESSION_SECRET ?? "secret",
        store: mongoStore,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7// 1 week
        }
    });