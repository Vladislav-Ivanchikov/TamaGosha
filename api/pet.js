import express, { json } from "express";
import { connectToDB } from "../src/modules/funcs/connectToDB.js";

const app = express();
app.use(json());

const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

connectToDB().catch((e) => console.error("Ошибка инициализации БД:", e));

app.get("/api/:userID/:petName", async (req, res) => {
  const { petName, userID } = req.params;
  const database = await connectToDB();
  try {
    if (!database) {
      throw new Error("DB not connected");
    }
    const collection = database.collection("pets");
    const pet = await collection.findOne({ userID, name: petName });
    res.json(pet || { error: "Pet not found" });
  } catch (e) {
    console.error("Error getting pet:", e);
    res.status(500).send("Error getting pet");
  }
});

app.post("/api/:userID/:petName", async (req, res) => {
  const { userID } = req.params;
  const database = await connectToDB();
  try {
    if (!database) {
      throw new Error("DB not connected");
    }
    const collection = database.collection("pets");
    const petData = { userID, ...req.body };
    delete petData._id;
    await collection.updateOne(
      { userID, name: petData.name },
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
