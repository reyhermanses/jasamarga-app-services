// src/utils/emailConfig.ts

import nodemailer from 'nodemailer';

import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'webmail.jasamarga.co.id',
  port: 25,
  secure: false,
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;
