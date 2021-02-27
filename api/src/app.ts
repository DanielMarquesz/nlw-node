//import { express } from "express";
//import { request } from 'supertest';
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import { router } from "./routes";
import createConnection from "./database";
import bodyParser from "body-parser";
import { AppError } from "./errors/AppError";
const app = express();

createConnection();
app.use(bodyParser.json());
app.use(router);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "Error",
      message: `Internal server error ${err.message}`,
    });
  }
);

export { app };
