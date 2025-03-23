import express, { json } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  if (!db) {
    try {
      console.log("Попытка подключения к MongoDB...");
      await client.connect();
      db = client.db("tamagosha");
      console.log("Подключено к базе данных:", db.databaseName);
    } catch (e) {
      console.error("Ошибка подключения к базе данных:", e);
      throw e;
    }
  }
  return db;
}

export default async function handler(req, res) {
  const { petName, userID } = req.query;
  try {
    await connectToDB();
    const collection = db.collection("pets");
    if (req.method === "GET") {
      const pet = await collection.findOne({ userID, petName });
      res.status(200).json(pet || { error: "Pet not found" });
    } else if (req.method === "POST") {
      const petData = { userID, petName, ...req.body };
      delete petData._id;
      await collection.updateOne(
        { userID, petName },
        { $set: petData },
        { upsert: true }
      );
      res.status(200).send("Pet saved");
    } else {
      res.status(405).send("Method not allowed");
    }
  } catch (e) {
    console.error("Error handling request:", e);
    res.status(500).send("Error handling request");
  }
}
