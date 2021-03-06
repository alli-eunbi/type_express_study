import { TODO } from "../types/todo";
import express from "express";
import fs from "fs";
import { toEditorSettings } from "typescript";

const todo = express();

todo.get("/todos", (req, res) => {
  const buffer = fs.readFileSync("./todos.json", { encoding: "utf8" });
  const todos: TODO[] = JSON.parse(buffer);
  res.statusCode = 200;
  return res.send(todos);
});

todo.post("/todos", (req, res) => {
  const { text } = req.body;
  //* 텍스트가 없다면 400에러

  if (!text) {
    res.statusCode = 400;
    return res.end();
  }
  const buffer = fs.readFileSync("./todos.json", { encoding: "utf8" });
  const { todos }: { todos: TODO[] } = JSON.parse(buffer);

  //? Todos 가 없다면
  if (!todos) {
    res.statusCode = 200;
    const newTodos = [
      {
        id: 1,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    fs.writeFileSync(
      "./todos.json",
      JSON.stringify({
        todos: newTodos,
      })
    );
    res.statusCode = 200;
    return res.send(newTodos);
  }

  //*새로운 todo 추가
  const newId = todos[todos.length - 1].id + 1;
  const newTodo: TODO = {
    id: newId,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const newTodos = [...todos, newTodo];
  fs.writeFileSync(
    "./todos.json",
    JSON.stringify({
      todos: newTodos,
    })
  );
  res.statusCode = 200;
  return res.send(newTodos);
});

//* todo 수정하기
todo.patch("/todos/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return (res.statusCode = 400);
  }
  const buffer = fs.readFileSync("./todos.json", { encoding: "utf8" });
  const { todos }: { todos: TODO[] } = JSON.parse(buffer);

  const index = todos.findIndex((todos) => todos.id === Number(id));
  if (index === -1) {
    return (res.statusCode = 400);
  }
  todos[index].completed = !todos[index].completed;

  fs.writeFileSync("./todos.json", JSON.stringify({ todos }));
  res.statusCode = 200;
  return res.send(todos);
});

todo.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return (res.statusCode = 400);
  }
  const buffer = fs.readFileSync("./todos.json", { encoding: "utf8" });
  const { todos }: { todos: TODO[] } = JSON.parse(buffer);
  const index = todos.findIndex((todos) => todos.id === Number(id));
  if (index === -1) {
    return (res.statusCode = 400);
  }
  todos.splice(index, 1);
  fs.writeFileSync("./todos.json", JSON.stringify({ todos }));
  res.statusCode = 200;
  return res.send(todos);
});

export default todo;
