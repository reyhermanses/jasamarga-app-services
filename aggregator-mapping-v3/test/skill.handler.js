const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('Skill Handler', async() => {
    let skillId = 0;
    
    it('Should Fail When Not Authenticated', async() => {
        const { status } = await request(server).get('/api/v1/skill');
        expect(status).to.equal(401);
    })

    it('Should Fetch Skills', async() => {
        const { status } = await request(server).get('/api/v1/skill')
        .set('x-api-key', process.env.API_KEY);
        expect(status).to.equal(200);
    })

    it('Should Fail When Input not Validated', async() => {
        const payload = {
            employee_id: 29674,
            skill: 'W'
        }

        const { status } = await request(server)
            .post('/api/v1/skill')
            .send(payload)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(422);
    })

    it('Should Create a new Skill', async () => {
        const payload = {
            employee_id: 29674,
            skill: "Web Development"
        }

        const { status } = await request(server)
            .post('/api/v1/skill')
            .send(payload)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(200);
    })

    it('Should fetch a Users Skills', async () => {
        const { body, status } = await request(server).get('/api/v1/skill?employee_id=29674').set('x-api-key', process.env.API_KEY);
        const { data } = body;
        expect(data).to.have.length(1);
        expect(status).to.equal(200)

        skillId = data[0].id
    })

    it('Should update Users Skill', async () => {
        const payload = {
            skill: "Mancing"
        }
        const { status } = await request(server)
            .put(`/api/v1/skill/${skillId}`)
            .send(payload)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(200);
    })

    it('Should delete Users Skill', async () => {
        const { status } = await request(server)
            .delete(`/api/v1/skill/${skillId}`)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(201);
    })
})