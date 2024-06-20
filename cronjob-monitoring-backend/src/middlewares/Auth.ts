import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/Auth';

import { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user: string | JwtPayload;
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = verifyJWT(token);
    (req as CustomRequest).user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Forbidden' });
  }
}
