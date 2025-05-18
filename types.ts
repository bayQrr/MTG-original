import { ObjectId } from "mongodb";


export interface User {
    _id: ObjectId;
    username: string;
    email?: string;
    password?: string;
    createdAt: Date;
    profileImage?: string;
}


export interface Cards {
    _id?: ObjectId;
    name: string;
    rarity?: string;
    text: string;
    type?: string;
    manaCost: string;
    imageUrl?: string;
}


export interface CardInDeck {
    name: string;
    count: number;
    type?: string;
    imageUrl: string;
    rarity?: string;
    manaCost?: string;
}


export interface Deck {
    _id?: ObjectId;
    userId: ObjectId;
    name: string;
    imageUrl: string;
    cards: CardInDeck[];
}

// Flash message 
export interface FlashMessage {
    type: "error" | "success";
    message: string;
}
