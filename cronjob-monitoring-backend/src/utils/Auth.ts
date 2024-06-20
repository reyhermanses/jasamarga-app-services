// utils/auth.ts

import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

import User from '../models/User'

const secret = process.env.SECRET_KEY || 'belumSempatDitambah' ;

export function generateJWT(user: User) {
  const payload = {
    userId: user.id,
  };
  return sign(payload, secret, { expiresIn: '1h' }); // You can adjust the token expiration time
}

export function verifyJWT(token: string) {
  return verify(token, secret);
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // You can adjust the number of salt rounds as needed

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}