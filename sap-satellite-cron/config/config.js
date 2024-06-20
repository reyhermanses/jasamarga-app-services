require('dotenv').config();
module.exports = {
  "public": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "logging": false,
    "migrationStorageTableSchema": "public",
    "pool": {
      "max": 1000000,
      "min": 0,
      "acquire": 3000000,
      "idle": 100
    }
  },
  "dev": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "logging": false,
    "migrationStorageTableSchema": "dev",
    "pool": {
      "max": 1000000,
      "min": 0,
      "acquire": 3000000,
      "idle": 100
    }
  }
}