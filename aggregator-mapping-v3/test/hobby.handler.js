const chai = require("chai");
const request = require("supertest");
const { server } = require("../app");
require("dotenv").config();
const { expect } = chai;

describe("Hobbies Handler", async () => {
  let hobbyId = 0;

  it("Should Fail When Not Authenticated", async () => {
    const { status } = await request(server).get("/api/v1/hobby");
    expect(status).to.equal(401);
  });

  it("Should Fetch Hobbies", async () => {
    const { status } = await request(server)
      .get("/api/v1/hobby")
      .set("x-api-key", process.env.API_KEY);
    expect(status).to.equal(200);
  });

  it("Should Fail When Input not Validated", async () => {
    const payload = { hobby: "b" };
    const { status } = await request(server)
      .post("/api/v1/hobby")
      .send(payload)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(status).to.equal(422);
  });

  it("Should Created a New Hobby", async () => {
    const payload = { employee_id: 29674, hobby: "bermain game" };
    const { status } = await request(server)
      .post("/api/v1/hobby")
      .send(payload)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(status).to.equal(200);
  });

  it("Should get a certain Limit of All Hobby Data", async () => {
    const { body, status } = await request(server)
      .get("/api/v1/hobby?limit=10")
      .set("x-api-key", process.env.API_KEY);
    const { data } = body;
    expect(status).to.equal(200);
    expect(data.rows.length <= 10).to.be.true;
  });

  it("Should fetch a Users Hobby", async () => {
    const { body, status } = await request(server)
      .get("/api/v1/hobby?employee_id=29674")
      .set("x-api-key", process.env.API_KEY);
    const { data } = body;
    expect(data.rows).to.have.length(1);
    expect(status).to.equal(200);

    hobbyId = data.rows[0].id;
  });

  it("Should update Users Hobby", async () => {
    const payload = { hobby: "bermain games" };
    const { status } = await request(server)
      .put(`/api/v1/hobby/${hobbyId}`)
      .send(payload)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(status).to.equal(200);
  });

  it("Should delete Users Hobby", async () => {
    const { status } = await request(server)
      .delete(`/api/v1/hobby/${hobbyId}`)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(status).to.equal(201);
  });
});
