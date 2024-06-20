// routes/authRoutes.ts

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { UserController } from '../controllers/UserController';
import { hashPassword, generateJWT } from '../utils/Auth';
import User from '../models/User';
import { createApiResponse } from '../utils/Response';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // If the user does not exist or the password is incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send(createApiResponse("invalid credential", 401, null));
    }

    // User authenticated; generate a JWT
    const token = generateJWT(user);

    const successResponse = createApiResponse("success", 200, { token });
    res.status(200).send(successResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send(createApiResponse("failed", 500, { error }));
  }
});


export default router;
