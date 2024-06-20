const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('Employee Alternative Handler', async () => {
  it('Should Fail When Not Authenticated', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall');
    expect(status).to.equal(401);
  })

  it('Should Fetch Employees', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall')
      .set('x-api-key', process.env.API_KEY)
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With Just npp', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade, name', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3&nama=denis')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade, name', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3&nama=denis')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade, name, unit_kerja_id', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3&nama=denis&unit_kerja_id=40000020')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade, name, unit_kerja_id, unit_kerja', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3&nama=denis&unit_kerja_id=40000020&unit_kerja=wlewlewle')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade, name, unit_kerja_id, unit_kerja, direktorat_id', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3&nama=denis&unit_kerja_id=40000020&unit_kerja=wlewlewle&direktorat_id=49000003')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade, name, unit_kerja_id, unit_kerja, direktorat_id, direktorat', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3&nama=denis&unit_kerja_id=40000020&unit_kerja=wlewlewle&direktorat_id=49000003&direktorat=Direktorat Baru')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Employees With npp, kd_comp, grade, name, unit_kerja_id, unit_kerja, direktorat_id, direktorat, departemen_id', async () => {
    const { status } = await request(server).get('/api/alternate/employee/getall?npp=10691&kd_comp=JSMR&grade=BOd-3&nama=denis&unit_kerja_id=40000020&unit_kerja=wlewlewle&direktorat_id=49000003&direktorat=Direktorat Baru&departemen_id=1')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fail When Query Input Params is Invalid', async () => {
    const { status } = await request(server)
      .get('/api/alternate/employee/getall?id=2')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(422);
  })

  it('Should Fetch Atasan', async () => {
    const { status } = await request(server).get('/api/alternate/employee/hierarchy/atasan?NPP=10499&CompanyCode=JSMR&PositionID=30011816')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fail When Filter Atasan Invalid', async () => {
    const { status } = await request(server).get('/api/alternate/employee/hierarchy/atasan?NPP=10499')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(422);
  })

  it('Should Fetch Bawahan', async () => {
    const { status } = await request(server).get('/api/alternate/employee/hierarchy/bawahan?NPP=D0014&CompanyCode=JSMR&PositionID=39000001')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fail When Filter Bawahan Invalid', async () => {
    const { status } = await request(server).get('/api/alternate/employee/hierarchy/bawahan?NPP=10691')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(422);
  })

  it('Should Fetch Count by Unit', async () => {
    const { status } = await request(server).get('/api/alternate/employee/organization')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Count by Unit with filter direktorat', async () => {
    const { status } = await request(server).get('/api/alternate/employee/organization?direktorat_id=49000003')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Count by Unit with filter direktorat and Unit', async () => {
    const { status } = await request(server).get('/api/alternate/employee/organization?direktorat_id=49000003&unit_kerja_id=40000020')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fetch Count by Unit with filter direktorat, Unit and Departement', async () => {
    const { status } = await request(server).get('/api/alternate/employee/organization?direktorat_id=49000003&unit_kerja_id=40000020&department_id=40000863')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })
})