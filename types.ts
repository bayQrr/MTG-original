import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    username: string;
    email?: string;
    password?: string;
    createdAt: Date;
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
export interface Deck {
    _id?: ObjectId;
    userId: ObjectId; 
    name: string;
    imageUrl: string;
    
  }
  

// flashmessage
export interface FlashMessage {
    type: "error" | "success"
    message: string;
}