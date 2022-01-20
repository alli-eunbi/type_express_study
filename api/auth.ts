import fs from "fs";
import express from "express";
import { userInfo } from "os";
import { USER } from "../types/user";
import jwt from "jsonwebtoken";

const auth = express();

auth.post("/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    res.statusCode = 400;
    return res.send("회원가입 실패");
  }
  if (password.length < 9) {
    return res.send("패스워드 길이 바꿔줘");
  }
  function email_check(email: string) {
    //이메일 확인 정규 표현식
    const emailCheckReg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    return emailCheckReg.test(email);
  }
  const buffer = fs.readFileSync("./users.json", { encoding: "utf8" });
  const { users }: { users: USER[] } = JSON.parse(buffer);
  if (users.some((_user) => _user.email === email)) {
    res.statusCode = 400;
    return res.send("이미 회원이 있습니다.");
  }
  const newId = users[users.length - 1].id + 1;
  const newUser: USER = {
    id: newId,
    email,
    name,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  fs.writeFileSync("./users.json", JSON.stringify({ users }));
  console.log(process.env.JWT_SECRET_KEY);
  if (!process.env.JWT_SECRET_KEY) {
    console.log("pp");
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
  //console.log(req.headers);
  //const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const decoded_user = jwt.verify(token, process.env.JWT_SECRET_KEY!);
  console.log(decoded_user);
});
export default auth;

//! bcrypt 비밀번호 암호화 저장,  로그인 : 비밀번호를 복호화해서 비밀번호 맞는지 확인, token return,
