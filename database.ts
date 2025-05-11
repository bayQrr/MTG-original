import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { Cards, User, Deck, CardInDeck } from "./types";
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

// // users 
// async function eergstegebruiker() {
//     if (await userCollectionMTG.countDocuments() > 0) {
//         return;
//     }
//     // let email : string | undefined=process.env.ADMIN_EMAIL;
//     let password: string | undefined = process.env.ADMIN_PASSWORD;
//     let username: string | undefined = process.env.ADMIN_USERNAME;
//     if (password === undefined || username === undefined) {
//         throw new Error("ADMIN_EMAIL ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment");
//     }
//     await userCollectionMTG.insertOne({
//         username: username,
//         password: await bcrypt.hash(password, saltRounds)
//     });
// }

export async function getUsers() {
    return await userCollectionMTG.find({}).toArray();
}

// Voeg deze functie toe om een nieuwe gebruiker aan te maken
export async function createUser(userData: { username: string; email: string; password: string }): Promise<any> {
    return await userCollectionMTG.insertOne({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        profileImage: "assets/images/dragonbadr.png",
        createdAt: new Date()
    });
}



// api fetchen
export async function getCards() {
    return await cardsCollection.find({}).toArray();
}

export async function loadCardsFromApi() {
    const cards: Cards[] = await getCards();
    if (cards.length == 0) {
        console.log("Database is leeg, kaarten laden van de API")
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

// kaartentoevoegen aan een deck

// Voeg een kaart toe aan het deck
export async function addCardToDeck(deckId: string, cardId: string, cardCount: number) {
    try {
        console.log("addCardToDeck() gestart met deckId:", deckId, "cardId:", cardId, "cardCount:", cardCount);

        // Deck zoeken
        const deck = await deckCollection.findOne({ _id: new ObjectId(deckId) });
        if (!deck) {
            console.log("Deck niet gevonden met _id:", deckId);
            return false;
        } else {
            console.log("Deck gevonden:", deck.name);
        }

        //aantal kaarten in een deck berekenen
        const totaalAantalKaarten = deck.cards?.reduce((acc, card) => acc + (card.count || 1), 0) || 0;

        if (totaalAantalKaarten + cardCount > 60) {
            console.log("Deck bevat al 60 kaarten of meer, kan niet meer toevoegen");
            return false; // Stop als limiet bereikt
        }



        // Kaart zoeken
        const card = await cardsCollection.findOne({ _id: new ObjectId(cardId) });
        if (!card) {
            console.log("Kaart niet gevonden met _id:", cardId);
            return false;
        } else if (!card.imageUrl) {
            console.log("Kaart gevonden, maar geen imageUrl:", card);
            return false;
        } else {
            console.log("Kaart gevonden:", card.name, "met imageUrl:", card.imageUrl);
        }

        // Check of de kaart al in het deck zit
        const bestaandeKaartIndex = deck.cards.findIndex(c => c.name === card.name);
        if (bestaandeKaartIndex > -1) {
            console.log("Kaart bestaat al in deck, verhoog count");
            await deckCollection.updateOne(
                { _id: new ObjectId(deckId), "cards.name": card.name },
                { $inc: { "cards.$.count": cardCount } }
            );
        } else {
            console.log("Kaart bestaat nog niet in deck, push nieuwe kaart");
            const nieuweKaart: CardInDeck = {
                name: card.name,
                imageUrl: card.imageUrl,
                count: cardCount,
                type: card.type ?? "onbekend",
                rarity: card.rarity ?? "onbekend",
                manaCost: card.manaCost
            };

            await deckCollection.updateOne(
                { _id: new ObjectId(deckId) },
                { $push: { cards: nieuweKaart } }
            );
        }

        return true;
    } catch (error) {
        console.error("Fout bij toevoegen van de kaart aan het deck:", error);
        return false;
    }
}


// login
export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Gebruikersnaam en wachtwoord moeten ingevuld zijn");
    }
    let user: User | null = await userCollectionMTG.findOne<User>({ username: username });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Wachtwoord is verkeerd");
        }
    } else {
        throw new Error("Gebruikersnaam niet gevonden");
    }
}
// random mana berekening
export function parseManaCost(manaCost: string): number {
    // Zoek patronen als {5}, {W}, {X}, {G/U}, etc.
    const matches = manaCost.match(/\{([^}]*)\}/g) ?? [];
    let total = 0;
    for (const match of matches) {
        // Verwijder { en }
        const symbol = match.replace(/[{}]/g, "");
        // Probeer te parsen als getal
        const numeric = parseInt(symbol, 10);
        if (!isNaN(numeric)) {
            // Het was een cijfer (zoals "5")
            total += numeric;
        } else {
            // Anders beschouwen we elk symbool als 1 (vereenvoudigde aanpak)
            total += 1;
        }
    }
    return total;
}
// kaart verwijeren in deck
export async function removeCardFromDeck(deckId: string, cardName: string, count: number) {
    const deck = await deckCollection.findOne({ _id: new ObjectId(deckId) });
    if (!deck || !deck.cards) return;

    const card = deck.cards.find(c => c.name === cardName);
    if (!card) return;

    if (card.count <= count) {
        // Hele kaart verwijderen
        await deckCollection.updateOne(
            { _id: new ObjectId(deckId) },
            { $pull: { cards: { name: cardName } } }
        );
    } else {
        // Enkel aantal verminderen
        await deckCollection.updateOne(
            { _id: new ObjectId(deckId), "cards.name": cardName },
            { $inc: { "cards.$.count": -count } }
        );
    }
}

// update user
export async function updateUser(userId: ObjectId, updatedData: { username?: string; password?: string; profileImage?: string }) {
    try {
        // Maak een object met de velden die moeten worden bijgewerkt
        const updateFields: { [key: string]: any } = {};

        if (updatedData.username) {
            updateFields.username = updatedData.username;
        }
        if (updatedData.password) {
            // Hash het nieuwe wachtwoord voordat je het opslaat
            updateFields.password = await bcrypt.hash(updatedData.password, saltRounds);
        }
        if (updatedData.profileImage) {
            updateFields.profileImage = updatedData.profileImage;
        }

        console.log("Update velden:", updateFields);
        console.log("User ID voor update:", userId);

        // Voer de update uit
        const result = await userCollectionMTG.updateOne(
            { _id: userId },
            { $set: updateFields }
        );

        console.log("Update resultaat:", result);

        // Controleer of de update succesvol was
        if (result.modifiedCount === 0) {
            console.log("Geen documenten bijgewerkt");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Fout bij updaten gebruiker:", error);
        return false;
    }
}



export async function connect() {
    await client.connect();
    console.log("Connected to database");
    // await eergstegebruiker();
    await loadCardsFromApi();
    process.on("SIGINT", exit);
}