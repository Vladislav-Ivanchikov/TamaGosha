import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export async function connectToDB() {
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
