// src/utils/emailUtils.ts

import transporter from '../config/EmailConfig';

import Handlebars from 'handlebars';

import * as dotenv from 'dotenv';
dotenv.config();

export async function sendEmail(to: string, subject: string, message: string, html: any, context: any): Promise<void> {

  const compileTemplate = Handlebars.compile(html);
  const compileHtml = compileTemplate(context);

  const mailOptions = {
    from: process.env.EMAIL_HOST,
    to,
    subject,
    text: message,
    html: compileHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}
