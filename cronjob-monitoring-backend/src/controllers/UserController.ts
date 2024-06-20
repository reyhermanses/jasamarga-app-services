// controllers/UserController.ts

import { Request, Response } from 'express';

import User from '../models/User';

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).send({ error: 'User not found' });
      } else {
        res.status(200).send(user);
      }
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }
}
