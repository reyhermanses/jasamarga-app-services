var Minio = require("minio");
const dotenv = require('dotenv')
dotenv.config()

var minioClient = new Minio.Client({
    endPoint: process.env.MINIO_URL,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

module.exports = minioClient