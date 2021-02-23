import "reflect-metadata";
import express from "express";
import { router } from "./routes";
import "./database";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());
app.use(router);

app.listen(3333, () => console.log("Server is running!"));
