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
      await client.connect();
      db = client.db("tamagosha");
      console.log("Connected to DB:", db.databaseName);
    } catch (e) {
      console.error("Error connecting to DB:", e);
    }
  }
  return db;
}

export async function handleRequest(req, res) {
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

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Сервер запущен на порту ${port}`);
// });

// connectToDB().catch((e) => console.error("Error connecting to DB:", e));

// app.get("/pet/:userID/:petName", async (req, res) => {
//   const { petName, userID } = req.params;
//   try {
//     if (!db) {
//       throw new Error("DB not connected");
//     }
//     const collection = db.collection("pets");
//     const pet = await collection.findOne({ userID, petName });
//     res.json(pet || { error: "Pet not found" });
//   } catch (e) {
//     console.error("Error getting pet:", e);
//     res.status(500).send("Error getting pet");
//   }
// });

// app.post("/pet/:userID/:petName", async (req, res) => {
//   const { petName, userID } = req.params;
//   try {
//     if (!db) {
//       throw new Error("DB not connected");
//     }
//     const collection = db.collection("pets");
//     const petData = { userID, petName, ...req.body };
//     delete petData._id;
//     await collection.updateOne(
//       { userID, petName },
//       { $set: petData },
//       { upsert: true }
//     );
//     res.status(200).send("Pet saved");
//   } catch (e) {
//     console.error("Error saving pet:", e);
//     res.status(500).send("Error saving pet");
//   }
// });

export default app;
