const chai = require('chai');
const request = require('supertest');
const path = require('path');
require('dotenv').config()
const { server } = require('../app');
const { expect } = chai;

describe('File Handler', async () => {
    it('Should Fail When Not Authenticated', async() => {
        const { status } = await request(server).get('/api/v1/employee_file');
        expect(status).to.equal(401);
    })

    it('Should Fetch Files', async() => {
        const { status } = await request(server).get('/api/v1/employee_file')
        .set('x-api-key', process.env.API_KEY);
        expect(status).to.equal(200);
    })

    it('Should get a certain Limit of All Files Data', async () => {
        const { body, status } = await request(server).get('/api/v1/employee_file?limit=10').set('x-api-key', process.env.API_KEY);
        const { data } = body;
        expect(status).to.equal(200)
        expect(data.rows.length <= 10).to.be.true;
    })

    it('Should Fail When Employee ID is not Provided', async () => {
        const { status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .attach('profile', path.resolve("uploads/profile.png"))
        expect(status).to.equal(422);
    })

    it('Should Update Profile Picture Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png"))
        expect(status).to.equal(200);
        expect(body.file_name).to.have.length(1)
    })

    it('Should Update Atachment KTP and Profile Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png" ))
        .attach('attachment_ktp', path.resolve("uploads/profile.png" ))
        expect(body.file_name).to.have.length(2)
        expect(status).to.equal(200);
    })
    
    it('Should Update Atachment KK, KTP and Profile Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png" ))
        .attach('attachment_kk', path.resolve("uploads/profile.png" ))
        .attach('attachment_ktp', path.resolve("uploads/profile.png" ))
        expect(body.file_name).to.have.length(3)
        expect(status).to.equal(200);
    })
    
    it('Should Update Atachment NPWP, KK, KTP and Profile Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png" ))
        .attach('attachment_kk', path.resolve("uploads/profile.png" ))
        .attach('attachment_ktp', path.resolve("uploads/profile.png" ))
        .attach('attachment_npwp', path.resolve("uploads/profile.png" ))
        expect(body.file_name).to.have.length(4)
        expect(status).to.equal(200);
    })
    
    it('Should Update Atachment BPJS Ket, NPWP, KK, KTP and Profile Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png" ))
        .attach('attachment_kk', path.resolve("uploads/profile.png" ))
        .attach('attachment_ktp', path.resolve("uploads/profile.png" ))
        .attach('attachment_npwp', path.resolve("uploads/profile.png" ))
        .attach('attachment_bpjs_ket', path.resolve("uploads/profile.png" ))
        expect(body.file_name).to.have.length(5)
        expect(status).to.equal(200);
    })
    
    it('Should Update Atachment BPJS Ket, BPJS Kes, NPWP, KK, KTP and Profile Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png" ))
        .attach('attachment_kk', path.resolve("uploads/profile.png" ))
        .attach('attachment_ktp', path.resolve("uploads/profile.png" ))
        .attach('attachment_npwp', path.resolve("uploads/profile.png" ))
        .attach('attachment_bpjs_ket', path.resolve("uploads/profile.png" ))
        .attach('attachment_bpjs_kes', path.resolve("uploads/profile.png" ))
        expect(body.file_name).to.have.length(6)
        expect(status).to.equal(200);
    })
    
    it('Should Update Atachment Buku Nikah, BPJS Ket, BPJS Kes, NPWP, KK, KTP and Profile Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png" ))
        .attach('attachment_kk', path.resolve("uploads/profile.png" ))
        .attach('attachment_ktp', path.resolve("uploads/profile.png" ))
        .attach('attachment_npwp', path.resolve("uploads/profile.png" ))
        .attach('attachment_bpjs_ket', path.resolve("uploads/profile.png" ))
        .attach('attachment_bpjs_kes', path.resolve("uploads/profile.png" ))
        .attach('attachment_buku_nikah', path.resolve("uploads/profile.png" ))
        expect(body.file_name).to.have.length(7)
        expect(status).to.equal(200);
    })
    
    it('Should Update Atachment Dana Pensiun, Buku Nikah, BPJS Ket, BPJS Kes, NPWP, KK, KTP and Profile Data', async () => {
        const { body, status } = await request(server).post('/api/v1/file/upload').set('x-api-key', process.env.API_KEY).field('Content-Type', 'multipart/form-data')
        .field('employee_id', '29674')
        .attach('profile', path.resolve("uploads/profile.png" ))
        .attach('attachment_kk', path.resolve("uploads/profile.png" ))
        .attach('attachment_ktp', path.resolve("uploads/profile.png" ))
        .attach('attachment_npwp', path.resolve("uploads/profile.png" ))
        .attach('attachment_bpjs_ket', path.resolve("uploads/profile.png" ))
        .attach('attachment_bpjs_kes', path.resolve("uploads/profile.png" ))
        .attach('attachment_buku_nikah', path.resolve("uploads/profile.png" ))
        .attach('attachment_dana_pensiun', path.resolve("uploads/profile.png" ))
        expect(body.file_name).to.have.length(8)
        expect(status).to.equal(200);
    })

    it('Should fetch a Users Files', async () => {
        const { body, status } = await request(server).get('/api/v1/employee_file?employee_id=29674').set('x-api-key', process.env.API_KEY);
        const { data } = body
        expect(status).to.equal(200)
        expect(data.rows.length <= 8).to.be.true
    })
})