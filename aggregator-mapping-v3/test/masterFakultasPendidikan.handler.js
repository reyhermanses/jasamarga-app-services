const chai = require("chai");
const request = require("supertest");
const { server } = require("../app");
require("dotenv").config();
const { expect } = chai;

describe("Master Fakultas Pendidikan Handler", async () => {
  let fakultasId = 0;
  it("Should Fail When Not Authenticated", async () => {
    const { status } = await request(server).get(
      "/api/v1/master/fakultas_pendidikan"
    );
    expect(status).to.equal(401);
  });

  it("Should Fetch Fakultas Pendidikan", async () => {
    const { status } = await request(server)
      .get("/api/v1/master/fakultas_pendidikan")
      .set("x-api-key", process.env.API_KEY);
    expect(status).to.equal(200);
  });

  it("Should Fail When Input not Validated", async () => {
    const payload = {
      name: "a",
      active: false,
    };

    const { status } = await request(server)
      .post("/api/v1/master/fakultas_pendidikan")
      .send(payload)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(status).to.equal(422);
  });

  it("Should Create a new Fakultas Pendidikan", async () => {
    const payload = {
      name: "BLABLABLA",
      active: false,
    };

    const { body, status } = await request(server)
      .post("/api/v1/master/fakultas_pendidikan")
      .send(payload)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    const { id } = body;
    expect(status).to.equal(200);
    fakultasId = id;
  });

  it("Should get a certain Limit of All Fakultas Pendidikan Data", async () => {
    const { body, status } = await request(server)
      .get("/api/v1/master/fakultas_pendidikan?limit=10")
      .set("x-api-key", process.env.API_KEY);
    const { data } = body;
    expect(status).to.equal(200);
    expect(data.rows.length <= 10).to.be.true;
  });

  it("Should update Fakultas Pendidikan", async () => {
    const payload = {
      name: "BLEBLEBLEBLE",
    };
    const { status } = await request(server)
      .put(`/api/v1/master/fakultas_pendidikan/${fakultasId}`)
      .send(payload)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(status).to.equal(200);
  });

  it("Should delete Fakultas Pendidikan", async () => {
    const { status } = await request(server)
      .delete(`/api/v1/master/fakultas_pendidikan/${fakultasId}`)
      .set("x-api-key", process.env.API_KEY)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(status).to.equal(201);
  });
});
