import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import todo from "./api/todo";
import bodyParser from "body-parser";
import auth from "./api/auth";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", todo);
app.use("/", auth);

// app.use((req, res, next) => {
//   try {
//     const token = req.headers.Authorization;
//     //? 토큰이 없다면
//     if (!token) {
//       next();
//     }
//     const id = jwt.verify(token, process.env.JWT_SECRET_KEY!);
//     const user_exist = User.findOne(id);
//     if (!user_exist) {
//       res.statusCode = 401;
//       return res.send("권한없음");
//     }
//     next();
//   } catch (e) {
//     res.statusCode = 500;
//     return res.send("500 에러");
//   }
// });
app.listen(3000, () => {
  console.log("server is started");
});

// const makeRamen = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("라면 끓이기");
//     }, 2000);
//   });
// };

// const eatRamen = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("다 먹음");
//     }, 5000);
//   });
// };

// const eat = async () => {
//   await makeRamen();
//   console.log("다만듬");

//   await eatRamen();
//   console.log("다먹음");
// };

// eat();
export default app;
