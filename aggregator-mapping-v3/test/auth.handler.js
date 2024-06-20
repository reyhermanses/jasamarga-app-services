const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');

const { expect } = chai;

describe('Auth Handler', async () => {
  it('Should Fail When Password or Username Inputted is Invalid', async () => {
    const { status } = await request(server)
      .post('/api/v1/auth/login')
      .set('x-api-key', process.env.API_KEY)
      .send({
        username: '66666',
        password: 'rijcard66'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(401)
  })

  it('Should Success When Password and Username Match', async () => {
    const { body, status } = await request(server)
      .post('/api/v1/auth/login')
      .set('x-api-key', process.env.API_KEY)
      .send({
        username: '66666',
        password: 'rijcard666'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200)
    expect(body.data).to.have.property('auth')
  })

  it('Should Success When LDAP User with Username and Password Match', async () => {
    const { body, status } = await request(server)
      .post('/api/v1/auth/login')
      .set('x-api-key', process.env.API_KEY)
      .send({
        username: '10691',
        password: 'j4s4m4rg4'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(200)
    expect(body.data).to.have.property('auth')
  })

  it('Should Fail When LDAP User with Username and Password Unmatch', async () => {
    const { status } = await request(server)
      .post('/api/v1/auth/login')
      .set('x-api-key', process.env.API_KEY)
      .send({
        username: '10691',
        password: 'Password123'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(status).to.equal(401)
  })
})