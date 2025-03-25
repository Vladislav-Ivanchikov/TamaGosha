import { connectToDB } from "../../src/modules/funcs/connectToDB";

export default async function handler(req, res) {
  const { petName, userID } = req.query;
  try {
    await connectToDB();
    const collection = db.collection("pets");
    if (req.method === "GET") {
      const pet = await collection.findOne({ userID, name: petName });
      res.status(200).json(pet || { error: "Pet not found" });
    } else if (req.method === "POST") {
      const petData = { userID, ...req.body };
      delete petData._id;
      await collection.updateOne(
        { userID, name: petData.name },
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
  } finally {
    if (client.isConnected()) await client.close();
  }
}
