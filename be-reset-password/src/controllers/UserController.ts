import { NextFunction, Request, Response } from "express";
import { buildApiResponse } from "../utils/Response";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
  static create = async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      await UserRepository.create(postData);
      return res
        .status(200)
        .send(buildApiResponse(true, 200, "User created successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static read = async (req: Request, res: Response) => {
    try {
      const data = await UserRepository.read(req.body);
      return res.status(200).send(buildApiResponse(true, 200, data));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static update = async (req: Request, res: Response) => {
    try {
      await UserRepository.update(req.params.id, req.body);
      return res
        .status(200)
        .send(buildApiResponse(true, 200, "User updated successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static delete = async (req: Request, res: Response) => {
    try {
      await UserRepository.delete(req.params.id);
      return res
        .status(200)
        .send(buildApiResponse(true, 200, "User deleted successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static userAuth = async (req: Request, res: Response) => {
    try {
      const data = await UserRepository.acquiredUserAuth(req, res);
      return res.status(200).send(buildApiResponse(true, 200, data));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
}
