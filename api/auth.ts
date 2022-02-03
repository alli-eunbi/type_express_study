import fs from "fs";
import express from "express";
import { userInfo } from "os";
import { USER } from "../types/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const auth = express();

auth.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  //*회원 가입 실패 케이스
  //1. email이나 비밀번호 입력 안한 경우
  if (!email || !password) {
    res.statusCode = 400;
    return res.send("회원가입 실패");
  }
  //2. 비밀번호 길이가 8자 이하일때
  if (password.length < 9) {
    return res.send("패스워드 길이 바꿔줘");
  }
  //3. email이 email형식으로 입력됐는지 확인
  function email_check(email: string) {
    //이메일 확인 정규 표현식
    const emailCheckReg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    return emailCheckReg.test(email);
  }
  //4. 이미 회원이 있는지 확인
  const buffer = fs.readFileSync("./users.json", { encoding: "utf8" });
  const { users }: { users: USER[] } = JSON.parse(buffer);
  if (users.some((_user) => _user.email === email)) {
    res.statusCode = 400;
    return res.send("이미 회원이 있습니다.");
  }

  //* 위 조건을 다 만족시켜 회원가입이 되는 경우
  //1. user의 index 값 생성
  const newId = users[users.length - 1].id + 1;
  //2. 비밀번호 암호화 저장
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  //salt, hash 따로 생성
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  console.log(hash);
  //user index, hash로 비번 저장
  const newUser: USER = {
    id: newId,
    email,
    name,
    password: hash,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  fs.writeFileSync("./users.json", JSON.stringify({ users }));

  //* user index로 토큰 생성
  if (!process.env.JWT_SECRET_KEY) {
    res.statusCode = 500;
    return res.end();
  }
  const token = jwt.sign(String(newUser.id), process.env.JWT_SECRET_KEY);
  res.statusCode = 200;
  res.setHeader("Set-Cookie", `access_token=${token};`);
  return res.send(token);
});

auth.get("/me", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.statusCode = 400;
    return res.send("로그인되지 않았습니다.");
  }
  const token = authorization.replace("Bearer ", "");
  console.log(token);
  const decoded_user = jwt.verify(token, process.env.JWT_SECRET_KEY!);
  console.log(decoded_user);
});

auth.post("/login", (req, res) => {
  const { email, password } = req.body;
  const buffer = fs.readFileSync("./users.json", { encoding: "utf8" });
  const { users }: { users: USER[] } = JSON.parse(buffer);
  //*로그인 실패 케이스
  if (!email || !password) {
    res.statusCode = 400;
    return res.send("아이디와 비밀번호를 입력해주세요");
  }
  if (!users.some((_user) => _user.email === email)) {
    res.statusCode = 400;
    return res.send("아이디가 틀렸습니다.");
  }
  if (!users.some((_user) => bcrypt.compareSync(password, _user.password))) {
    res.statusCode = 400;
    return res.send("비밀번호가 틀렸습니다.");
  }

  //* user index로 토큰 생성
  if (!process.env.JWT_SECRET_KEY) {
    res.statusCode = 500;
    return res.end();
  }
  const id = users.findIndex((_user) => {
    _user.email === email;
    return _user.id;
  });
  const token = jwt.sign(String(id), process.env.JWT_SECRET_KEY);
  res.statusCode = 200;
  res.setHeader("Set-Cookie", `access_token=${token};`);
  return res.send(token);
});

// auth.delete();
export default auth;
