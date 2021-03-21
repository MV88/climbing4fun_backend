const supertest = require("supertest");

const app = require('../../../../app');

describe("GET /api/v1/styles", () => {
  it("should respond with an array of styles", async () => {
    const response = await supertest(app)
      .get("/api/v1/styles")
      .expect("Content-Type", /json/)
      .expect(200);
    console.log("response.body", response.body);
    expect(response.body.length).toEqual(6);
  });
});
