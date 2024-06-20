// config/sequelize.ts

import { Sequelize } from "sequelize";

import * as dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME || "";
const dbUsername = process.env.DB_USERNAME || "";
const dbPassword = process.env.DB_PASSWORD || "";
const dbHost = process.env.DB_HOST || "";
const dbSchema = process.env.DB_SCHEMA || "";
const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  schema: dbSchema,
  logging: false,
});

export default sequelize;