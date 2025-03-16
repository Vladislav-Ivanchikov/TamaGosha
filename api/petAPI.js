const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  try {
    await client.connect();
    db = client.db("tamagosha");
    console.log("Connected to DB:", db.databaseName);
  } catch (e) {
    console.error("Error connecting to DB:", e);
  }
}

connectToDB();

app.get("/:userID/:petName", (req, res) => {
  const { petName, userID } = req.params;
  try {
    const collection = db.collection("pets");
    const pet = collection.findOne(userID, petName);
    res.json(pet || { error: "Pet not found" });
  } catch (e) {
    console.error("Error getting pet:", e);
    res.status(500).send("Error getting pet");
  }
});

app.post("/:userID/:petName", (req, res) => {
  const { petName, userID } = req.params;
  try {
    const collection = db.collection("pets");
    const petData = { userID, petName, ...req.body };
    collection.updateOne(
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

module.exports = app;
