import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
import { User } from "./types";
import bcrypt from "bcrypt";

const saltRounds : number = 10;

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
export const client = new MongoClient(MONGODB_URI);
export const userCollectionMTG = client.db("MTG").collection<User>("users");


async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

async function eergstegebruiker() {
    if (await userCollectionMTG.countDocuments() > 0) {
        return;
    }
    // let email : string | undefined=process.env.ADMIN_EMAIL;
    let password : string | undefined =process.env.ADMIN_PASSWORD;
    let username:string|undefined=process.env.ADMIN_USERNAME;
    if ( password === undefined ||username===undefined) {
        throw new Error("ADMIN_EMAIL ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment");
    }
    await userCollectionMTG.insertOne({
     username:username,
    password: await bcrypt.hash(password, saltRounds)
    });
}

export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email en ww moet");
    }
    let user : User | null = await userCollectionMTG.findOne<User>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("ww fout");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function connect() {
    await client.connect();
    console.log("Connected to database");
    await eergstegebruiker();
    process.on("SIGINT", exit);
}