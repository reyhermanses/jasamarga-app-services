const repository = require('../repositories/skill.repository')

const getAllData = async (req) => {
    return await repository.acquireAllData(req.query)
}

const createData = async (body) => {
    return await repository.generate(body)
}

const getOneByIdData = async (id) => {
    return await repository.acquireById(id)
}

const updateData = async (id, data) => {
    return await repository.modernize(id, data)
}

async function destroyData(id) {
    return await repository.remove(id)
}

module.exports = {
    getAllData,
    createData,
    getOneByIdData,
    updateData,
    destroyData
}