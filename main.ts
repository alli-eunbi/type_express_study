import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import todo from "./api/todo";
import bodyParser from "body-parser";
import auth from "./api/auth";

const app = express();

app.use(bodyParser.json());
app.use("/", todo);
app.use("/", auth);
app.listen(3000, () => {
  console.log("server is started");
});
