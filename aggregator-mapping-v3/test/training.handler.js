const chai = require('chai');
const request = require('supertest');
const { server } = require('../app');
require('dotenv').config()
const { expect } = chai;

describe('Training Handler', async () => {
    let trainingId = 0;
    
    it('Should Fail When Not Authenticated', async() => {
        const { status } = await request(server).get('/api/v1/training');
        expect(status).to.equal(401);
    })

    it('Should Fetch Trainings', async () => {
        const { status } = await request(server).get('/api/v1/training')
        .set('x-api-key', process.env.API_KEY);
        expect(status).to.equal(200);
    })

    it('Should Fail When Input not Validated', async () => {
        const payload = {
            employee_id: 29674,
            pelatihan: "pelatihan K3",
            pelaksanaan: "PT. Jasa Marga",
            tempat: "Kantor Pusat",
            kota: "DKI Jakarta",
            inisiator: "Unit Jasa Marga Development Center",
            no_penugasan: "NOPEN.100ABC",
            klp_plth1: "In House",
            klp_plth2: "Business Support",
            negara: "Indonesia",
            nosertifikat: "SRT20230001",
            nilai: "100",
            peringkat: "1",
            biaya: "12000X"
        }

        const { status } = await request(server)
            .post('/api/v1/training')
            .send(payload)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(422);
    })

    it('Should Created a New Training', async () => {
        const payload = {
            employee_id: 29674,
            pelatihan: "pelatihan K3",
            pelaksanaan: "PT. Jasa Marga",
            tempat: "Kantor Pusat",
            kota: "DKI Jakarta",
            inisiator: "Unit Jasa Marga Development Center",
            no_penugasan: "NOPEN.100ABC",
            klp_plth1: "In House",
            klp_plth2: "Business Support",
            negara: "Indonesia",
            nosertifikat: "SRT20230001",
            nilai: "100",
            peringkat: "1",
            biaya: "12000",
            tahun: "2023",
            tgl_awal: "2023-01-01",
            tgl_akhir: "2023-01-02"
        }

        const { status } = await request(server)
            .post('/api/v1/training')
            .send(payload)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(200);
    })

    it('Should get a certain Limit of All Training Data', async () => {
        const { body, status } = await request(server).get('/api/v1/training?limit=10')
        .set('x-api-key', process.env.API_KEY);
        const { data } = body;
        expect(status).to.equal(200)
        expect(data.rows.length <= 10).to.be.true;
    })

    it('Should fetch a Users Training', async () => {
        const { body, status } = await request(server).get('/api/v1/training?employee_id=29674')
        .set('x-api-key', process.env.API_KEY);
        const { data } = body;
        expect(data.rows).to.have.length(1);
        expect(status).to.equal(200)

        trainingId = data.rows[0].id
    })

    it('Should update Users Training', async () => {
        const payload = {
            nilai: "100",
            peringkat: "1",
            biaya: "13000"
        }
        const { status } = await request(server)
            .put(`/api/v1/training/${trainingId}`)
            .send(payload)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(200);
    })

    it('Should delete Users Training', async () => {
        const { status } = await request(server)
            .delete(`/api/v1/training/${trainingId}`)
            .set('x-api-key', process.env.API_KEY)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect( status ).to.equal(201);
    })
})