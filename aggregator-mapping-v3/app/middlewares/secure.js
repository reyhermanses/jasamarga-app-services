const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const sendResponse = require('../resources/responseApi')
dotenv.config()

async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if(!authHeader) {
            res.status(403).send(sendResponse.unauthorized("Go Find Your Credential"))
        } else {
            const token = authHeader && authHeader.split(' ')[1]
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
                if(err) {
                    res.status(403).send(sendResponse.unauthorized("False Credential"))
                } else {
                    req.user = {
                        "username": decoded.username,
                        "access": decoded.access,
                        "id": decoded.id,
                        "role": decoded.role
                    }
                    next()
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(sendResponse.internalServerError())
    }
}

module.exports = {
    authenticateToken
}