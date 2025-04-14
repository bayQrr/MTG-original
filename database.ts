import dotenv from "dotenv";
import { MongoClient,ObjectId } from "mongodb";
import { Cards, User,Deck } from "./types";
import bcrypt from "bcrypt";

dotenv.config();

const saltRounds: number = 10;

// Exporteer de MongoDB URI
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
export const DB_NAME = "MTGdb";

// Maak MongoDB client
const client = new MongoClient(MONGODB_URI);

// Exporteer de database collectie die we nodig hebben
export const userCollectionMTG = client.db(DB_NAME).collection("users"); 
export const cardsCollection = client.db(DB_NAME).collection<Cards>("cards");
export const deckCollection = client.db(DB_NAME).collection<Deck>("decks");


async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

// users 
async function eergstegebruiker() {
    if (await userCollectionMTG.countDocuments() > 0) {
        return;
    }
    // let email : string | undefined=process.env.ADMIN_EMAIL;
    let password: string | undefined = process.env.ADMIN_PASSWORD;
    let username: string | undefined = process.env.ADMIN_USERNAME;
    if (password === undefined || username === undefined) {
        throw new Error("ADMIN_EMAIL ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment");
    }
    await userCollectionMTG.insertOne({
        username: username,
        password: await bcrypt.hash(password, saltRounds)
    });
}

export async function getUsers() {
    return await userCollectionMTG.find({}).toArray();
}


// api fetchen
export async function getCards() {
    return await cardsCollection.find({}).toArray();
}

export async function loadCardsFromApi() {
    const cards: Cards[] = await getCards();
    if (cards.length == 0) {
        console.log("Database is leeg, loading users from API")
        const response = await fetch("https://api.magicthegathering.io/v1/cards");
        const data = await response.json();
        const cardsFromApi: Cards[] = data.cards;
        await cardsCollection.insertMany(cardsFromApi);
    }
}

export async function getFilteredCards({ zoekterm = "", rarity = "" }) {
    const allCards = await getCards();

    const filtered = allCards.filter((card) => {
        const naam = card.name?.toLowerCase() || "";
        const zoek = zoekterm.toLowerCase();

        const naamBegintMetZoekterm = zoek ? naam.startsWith(zoek) : true;
        const komtOvereenMetRarity = rarity ? card.rarity?.toLowerCase() === rarity.toLowerCase() : true;

        return naamBegintMetZoekterm && komtOvereenMetRarity;
    });

    return filtered;
}

// crud toepassen bij deck pagina

// Create
export async function createDeck(deck: Deck) {
    const result = await deckCollection.insertOne(deck);
    return result;
  }
  
  // Read (alle decks van een user)
  export async function getDecksByUser(userId: ObjectId) {
    return await deckCollection.find({ userId }).toArray();
  }
  
  // Update
  export async function updateDeck(deckId: ObjectId, updatedDeck: Partial<Deck>) {
    return await deckCollection.updateOne({ _id: deckId }, { $set: updatedDeck });
  }
  
  // Delete
  export async function deleteDeck(deckId: ObjectId) {
    return await deckCollection.deleteOne({ _id: deckId });
  }
// login
export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email en ww moet");
    }
    let user: User | null = await userCollectionMTG.findOne<User>({ username: username });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Wachtwoord is fout");
        }
    } else {
        throw new Error("User niet gevonden");
    }
}

export async function connect() {
    await client.connect();
    console.log("Connected to database");
    await eergstegebruiker();
    await loadCardsFromApi();
    process.on("SIGINT", exit);
}