import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "Hello Brothar" });
});

app.post("/", (req, res) => {
  return res.status(201).json({ message: "Dados enviados com sucesso" });
});

app.listen(3333, () => console.log("Server is running!"));
