// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import fs from "fs";
// import todo from "./api/todo";
// import bodyParser from "body-parser";
// import auth from "./api/auth";

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/", todo);
// app.use("/", auth);
// app.listen(3000, () => {
//   console.log("server is started");
// });

const makeRamen = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("라면 끓이기");
    }, 2000);
  });
};

const eatRamen = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("다 먹음");
    }, 5000);
  });
};

const eat = async () => {
  await makeRamen();
  console.log("다만듬");

  await eatRamen();
  console.log("다먹음");
};

eat();
