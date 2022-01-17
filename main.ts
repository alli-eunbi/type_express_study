import express from "express";
import fs from "fs";
import todo from "./api/todo";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use("/", todo);
app.listen(3000, () => {
  console.log("server is started");
});
