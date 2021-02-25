import "reflect-metadata";
import express from "express";
import { router } from "./routes";
import createConnection from "./database";
import bodyParser from "body-parser";
const app = express();

createConnection();
app.use(bodyParser.json());
app.use(router);

export { app };
