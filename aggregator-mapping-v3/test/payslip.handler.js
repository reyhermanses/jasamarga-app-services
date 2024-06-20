const chai = require("chai");
const request = require("supertest");
const {
  server
} = require("../app");
require('dotenv').config()

const {
  expect
} = chai;

describe("Payslip Handler", async () => {
  let auth = {};
  let payslipId = 0;
  before(loginUser(auth));

  it("Should Fetch Payslip", async () => {
    const {
      status
    } = await request(server)
      .get(
        "/api/v1/payslip/?type=regular&npp=10691&kd_comp=1&personal_area_id=1000&unit_kerja_id=40000020"
      )
      // .set("Authorization", "bearer " + auth.token);
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  });
});