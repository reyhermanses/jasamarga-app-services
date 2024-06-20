const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('Education Handler', async () => {
  let educationId = 0;
  it('Should Fail When Not Authenticated', async () => {
    const { status } = await request(server).get('/api/v1/education');
    expect(status).to.equal(401);
  })

  it('Should Fetch Educations', async () => {
    const { status } = await request(server).get('/api/v1/education')
      .set('x-api-key', process.env.API_KEY)
    expect(status).to.equal(200);
  })

  it('Should Fail When Input not Validated', async () => {
    const payload = {
      ref_jenjang_pendidikan_id: "2",
      ref_jurusan_pendidikan_id: "41xx",
      no_ijazah: "123abc",
      final_score: "200",
      name: "test",
      country_id: "102",
      start_date: "2022-01-01",
      graduate_date: "2022-10-10"
    }

    const { status } = await request(server)
      .post('/api/v1/education')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(422);
  })

  it('Should Create a new Education', async () => {
    const payload = {
      employee_id: 29674,
      ref_jenjang_pendidikan_id: "2",
      ref_jurusan_pendidikan_id: "10",
      no_ijazah: "123abc",
      final_score: "3.45",
      name: "test",
      country_id: "102",
      start_date: "2022-01-01",
      graduate_date: "2022-10-10"
    }

    const { status } = await request(server)
      .post('/api/v1/education')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200);
  })

  it('Should get a certain Limit of All Education Data', async () => {
    const { body, status } = await request(server).get('/api/v1/education?limit=10')
      .set('x-api-key', process.env.API_KEY)
    const { data } = body;
    expect(status).to.equal(200)
    expect(data.rows.length <= 10).to.be.true;
  })

  it('Should fetch a Users Education', async () => {
    const { body, status } = await request(server).get('/api/v1/education?employee_id=29674')
      .set('x-api-key', process.env.API_KEY)
    const { data } = body;
    expect(status).to.equal(200)
    educationId = data.rows[0].id
  })

  it('Should fetch One Education', async () => {
    const { body, status } = await request(server).get(`/api/v1/education/${educationId}`)
      .set('x-api-key', process.env.API_KEY)
    const { data } = body;
    expect(data).to.have.property('id', educationId)
    expect(status).to.equal(200)
  })

  it('Should update Users Education', async () => {
    const payload = {
      ref_jurusan_pendidikan_id: "11"
    }
    const { status } = await request(server)
      .put(`/api/v1/education/${educationId}`)
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200);
  })

  it('Should delete Users Education', async () => {
    const { status } = await request(server)
      .delete(`/api/v1/education/${educationId}`)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(201);
  })
})