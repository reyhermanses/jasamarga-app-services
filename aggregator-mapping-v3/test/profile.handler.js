const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('Profile Handler', async () => {
  let profileId = 0;

  it('Should Fail When Not Authenticated', async () => {
    const { status } = await request(server).get('/api/v1/profile');
    expect(status).to.equal(401);
  })

  it('Should Fetch Profiles', async () => {
    const { status } = await request(server).get('/api/v1/profile')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fail When Input not Validated', async () => {
    const payload = {
      employee_id: 29674,
      place_of_birth: 'B'
    }

    const { status } = await request(server)
      .post('/api/v1/profile')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(422);
  })

  it('Should Create a new Profile Data', async () => {
    const payload = {
      employee_id: 29674,
      rt: "002",
      rw: "002",
      rt_domicile: "002",
      rw_domicile: "002"
    }

    const { status } = await request(server)
      .post('/api/v1/profile')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200);
  })

  it('Should Fail When Data Existed', async () => {
    const payload = {
      employee_id: 29674,
      rt: "002",
      rw: "002",
      rt_domicile: "002",
      rw_domicile: "002"
    }

    const { status } = await request(server)
      .post('/api/v1/profile')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(409);
  })

  it('Should fetch User Created Data', async () => {
    const { body, status } = await request(server).get('/api/v1/profile?employee_id=29674').set('x-api-key', process.env.API_KEY);
    const { data } = body;
    expect(status).to.equal(200)
    profileId = data[0].id
  })

  it('Should Fetch one Profile Data', async () => {
    const { body, status } = await request(server).get(`/api/v1/profile/${profileId}`).set('x-api-key', process.env.API_KEY);
    const { data } = body;
    expect(data).to.have.property('id', profileId)
    expect(status).to.equal(200)
  })

  it('Should Update Users Profile', async () => {
    const payload = {
      employee_id: 29674,
      place_of_birth: 'Brebes'
    }

    const { status } = await request(server)
      .put(`/api/v1/profile/${profileId}`)
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200);
  })

  it('Should delete Users Profile', async () => {
    const { status } = await request(server)
      .delete(`/api/v1/profile/${profileId}`)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(201);
  })
})