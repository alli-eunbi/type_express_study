const request = require("supertest");
import app from "../main";

function sum(a: any, b: any) {
  return a + b;
}

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

describe("todos", () => {
  it("should return world!", (done) => {
    request(app)
      .get("/todos")
      .set("Accept", "application/json")
      .expect(200)
      .then((res: any) => {
        console.log(res.body);
        expect(res.body?.todos?.length).toBe(1);
        done();
      });
  });
});
