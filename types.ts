import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    username: string;
    email?: string;
    password?: string;

}


export interface Cards {
    _id?: ObjectId;
    name: string;
    rarity: string;
    text: string;
    type: string;
    manaCost: string;
    imageUrl: string;

}