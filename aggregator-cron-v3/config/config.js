require("dotenv").config();
module.exports = {
  dev2: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    migrationStorageTableSchema: "dev2",
    pool: {
      max: 1000000,
      min: 0,
      acquire: 3000000,
      idle: 100,
    },
  },
  dev_uat: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    migrationStorageTableSchema: "dev_uat",
    pool: {
      max: 1000000,
      min: 0,
      acquire: 3000000,
      idle: 100,
    },
  },
  dev_testing: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    migrationStorageTableSchema: "dev_testing",
    pool: {
      max: 1000000,
      min: 0,
      acquire: 3000000,
      idle: 100,
    },
  },
  new_dev: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    migrationStorageTableSchema: "new_dev",
    pool: {
      max: 1000000,
      min: 0,
      acquire: 3000000,
      idle: 100,
    },
  },
  public: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    migrationStorageTableSchema: "public",
    pool: {
      max: 1000000,
      min: 0,
      acquire: 3000000,
      idle: 100,
    },
  },
};
