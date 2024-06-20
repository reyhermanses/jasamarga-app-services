import { NextFunction, Request, Response } from "express";
import { buildApiResponse } from "../utils/Response";
import { RoleRepository } from "../repositories/RoleRepository";

export class RoleController {
  static create = async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      await RoleRepository.create(postData);
      return res
        .status(200)
        .send(buildApiResponse(true, 200, "User created successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static read = async (req: Request, res: Response) => {
    try {
      const data = await RoleRepository.read(req.body);
      return res.status(200).send(buildApiResponse(true, 200, data));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static update = async (req: Request, res: Response) => {
    try {
      await RoleRepository.update(req.params.id, req.body);
      return res
        .status(200)
        .send(buildApiResponse(true, 200, "User updated successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static delete = async (req: Request, res: Response) => {
    try {
      await RoleRepository.delete(req.params.id);
      return res
        .status(200)
        .send(buildApiResponse(true, 200, "User deleted successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
}
