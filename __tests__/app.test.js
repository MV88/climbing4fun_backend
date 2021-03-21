const supertest = require('supertest');
const app = require('../app');
const { API } = require('../src/constants/project');

describe("App", () => {
  it("should respond with a message", async () => {
    const response = await supertest(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body.message).toEqual(API);
  });
});
