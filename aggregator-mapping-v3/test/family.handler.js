const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('Family Handler', async () => {
  let familyId = 0;
  it('Should Fail When Not Authenticated', async () => {
    const { status } = await request(server).get('/api/v1/family');
    expect(status).to.equal(401);
  })

  it('Should Fetch Families', async () => {
    const { status } = await request(server).get('/api/v1/family').set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Families Alternate', async () => {
    const { status } = await request(server).get('/api/alternate/employee/family').set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fail When Input not Validated', async () => {
    const payload = {
      name: "adib bachtiar",
      place_of_birth: "brebes",
      date_of_birth: "1999-08-16x",
      religion_id: "22",
      gender: "Laki-Laki",
      family_status_id: "7"
    }

    const { status } = await request(server)
      .post('/api/v1/family')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(422);
  })

  it('Should Create a new Family', async () => {
    const payload = {
      employee_id: 29674,
      name: "adib bachtiar",
      place_of_birth: "brebes",
      date_of_birth: "1999-08-16",
      religion_id: "22",
      gender: "Laki-Laki",
      family_status_id: "2",
      object_id: "1"
    }

    const { status } = await request(server)
      .post('/api/v1/family')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(201);
  })

  it('Should get a certain Limit of All Family Data', async () => {
    const { body, status } = await request(server).get('/api/v1/family?limit=10').set('x-api-key', process.env.API_KEY);
    const { data } = body;
    expect(status).to.equal(200)
    expect(data.rows.length <= 10).to.be.true;
  })

  it('Should fetch a Users Family', async () => {
    const { body, status } = await request(server).get('/api/v1/family?employee_id=29674').set('x-api-key', process.env.API_KEY);
    const { data } = body;
    expect(data.rows).to.have.length(1);
    expect(status).to.equal(200)

    familyId = data.rows[0].id
  })

  it('Should fetch One Family', async () => {
    const { body, status } = await request(server).get(`/api/v1/family/${familyId}`).set('x-api-key', process.env.API_KEY);
    const { data } = body;
    expect(data).to.have.property('id', familyId)
    expect(status).to.equal(200)
  })

  it('Should update Users Family', async () => {
    const payload = {
      name: "adib bachtiars",
      place_of_birth: "brebes",
      date_of_birth: "1999-08-16",
      religion_id: "22",
      gender: "Laki-Laki",
      family_status_id: "2"
    }
    const { status } = await request(server)
      .put(`/api/v1/family/${familyId}`)
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200);
  })

  it('Should delete Users Family', async () => {
    const { status } = await request(server)
      .delete(`/api/v1/family/${familyId}`)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(201);
  })
})