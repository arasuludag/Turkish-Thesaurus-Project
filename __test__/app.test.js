const request = require("supertest");
const app = require("../app");

describe("Test Register", () => {
  test("POST /api/register", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
  // More things come here
});
