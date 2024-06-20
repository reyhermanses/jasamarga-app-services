const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('Org Formation', async () => {

  it('Should Fail When Not Authenticated', async () => {
    const { status } = await request(server).get('/api/v1/training');
    expect(status).to.equal(401);
  })

  it('Should Fetch all Org Formation', async () => {
    const { status } = await request(server).get('/api/v1/organization_hierarchy/formation?org_id=41000146')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fail When personal_area_id is not set', async () => {
    const { status } = await request(server).get('/api/v1/organization_hierarchy/org_filter_formation')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(422);
  })

  it('Should Fetch All Org Filter Formation', async () => {
    const { status } = await request(server).get('/api/v1/organization_hierarchy/org_filter_formation?personal_area_id=3000&parent_id=41000142')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })
})