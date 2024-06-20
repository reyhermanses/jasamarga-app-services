const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('History Jabatan Handler', async () => {
  let historyJabatanId = 0

  it('Should Fail When not Authenticated', async () => {
    const { status } = await request(server).get('/api/v1/history_jabatan');
    expect(status).to.equal(401);
  })

  it('Should Fetch All History Jabatan', async () => {
    const { status } = await request(server).get('/api/v1/history_jabatan')
      .set('x-api-key', process.env.API_KEY);
    expect(status).to.equal(200);
  })

  it('Should Fail When Input not Validated', async () => {
    const payload = {
      employee_id: 6999,
      angkatan: "2a",
      posisi: "a",
      sk_posisi: "ab",
      awal_posisi: "2022-12-10",
      akhir_posisi: "2022-12-10",
      grade: "ab",
      level: "1b",
      konversi: "BOD",
      unit: "a",
      kd_comp: 1
    }

    const { status } = await request(server)
      .post('/api/v1/history_jabatan')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(422);
  })

  it('Should Create a new History Jabatan', async () => {
    const payload = {
      employee_id: 29674,
      angkatan: 2021,
      posisi: "Direktur Uhuy",
      sk_posisi: "666-999-666",
      awal_posisi: "2022-12-10",
      akhir_posisi: "2022-12-11",
      grade: "ab",
      level: "1b",
      konversi: "BOD",
      unit: "a",
      kd_comp: 1,
      sk_position_date: '2023-02-02',
      action: 'promosi',
      is_main: false
    }
    const { status } = await request(server)
      .post('/api/v1/history_jabatan')
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200);
  })

  it('Should Fetch Users History Jabatan', async () => {
    const { body, status } = await request(server).get('/api/v1/history_jabatan?employee_id=29674')
      .set('x-api-key', process.env.API_KEY);
    const { data } = body
    expect(data).to.have.length(1);
    expect(status).to.equal(200);

    historyJabatanId = data[0].id
  })

  it('Should Fail When Users History Jabatan not Found', async () => {
    const payload = {
      angkatan: 1968
    }

    const { status } = await request(server)
      .put(`/api/v1/history_jabatan/0`)
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(404);
  })

  it('Should Update Users History Jabatan', async () => {
    const payload = {
      angkatan: 1968
    }

    const { status } = await request(server)
      .put(`/api/v1/history_jabatan/${historyJabatanId}`)
      .send(payload)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200);
  })

  it('Should delete Users History Jabatan', async () => {
    const { status } = await request(server)
      .delete(`/api/v1/history_jabatan/${historyJabatanId}`)
      .set('x-api-key', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(201);
  })
})