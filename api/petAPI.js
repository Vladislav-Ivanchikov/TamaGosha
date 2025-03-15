const express = require("express");
const app = express();
app.use(express.json());

let pets = {};

app.get("/:name", (req, res) => {
  const petName = req.params.name;
  res.json(pets[petName] || { error: "Pet not found" });
});

app.post("/:name", (req, res) => {
  const petName = req.params.name;
  pets[petName] = req.body;
  res.sendStatus(200);
});

module.exports = app;
