import express, { json } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(json());

let db;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

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

connectToDB().catch((e) => console.error("Ошибка инициализации БД:", e));

app.get("/api/:userID/:petName", async (req, res) => {
  const { petName, userID } = req.params;
  const database = await connectToDB();
  try {
    if (!database) {
      throw new Error("DB not connected");
    }
    const collection = database.collection("pets");
    const pet = await collection.findOne({ userID, petName });
    res.json(pet || { error: "Pet not found" });
  } catch (e) {
    console.error("Error getting pet:", e);
    res.status(500).send("Error getting pet");
  }
});

app.post("/api/:userID/:petName", async (req, res) => {
  const { petName, userID } = req.params;
  const database = await connectToDB();
  try {
    if (!database) {
      throw new Error("DB not connected");
    }
    const collection = database.collection("pets");
    const petData = { userID, petName, ...req.body };
    delete petData._id;
    await collection.updateOne(
      { userID, petName },
      { $set: petData },
      { upsert: true }
    );
    res.status(200).send("Pet saved");
  } catch (e) {
    console.error("Error saving pet:", e);
    res.status(500).send("Error saving pet");
  }
});

export default app;
