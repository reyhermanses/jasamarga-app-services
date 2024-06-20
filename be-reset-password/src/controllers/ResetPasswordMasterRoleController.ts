import { NextFunction, Request, Response } from "express";
import { buildApiResponse } from "../utils/Response";
import { ResetPasswordMasterRoleRepository } from "../repositories/ResetPasswordMasterRoleRepository";

export class ResetPasswordMasterRole {
  static create = async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      const data = await ResetPasswordMasterRoleRepository.create(postData);
      return res
        .status(500)
        .send(buildApiResponse(true, 200, "Master Role created successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static read = async (req: Request, res: Response) => {
    try {
      const data = await ResetPasswordMasterRoleRepository.read(req.body);
      return res.status(500).send(buildApiResponse(true, 200, data));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static update = async (req: Request, res: Response) => {
    try {
      const data = await ResetPasswordMasterRoleRepository.update(
        req.params.id,
        req.body
      );
      return res
        .status(500)
        .send(buildApiResponse(true, 200, "Master Role updated successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
  static delete = async (req: Request, res: Response) => {
    try {
      const data = await ResetPasswordMasterRoleRepository.delete(
        req.params.id
      );
      return res
        .status(500)
        .send(buildApiResponse(true, 200, "Master Role deleted successfully"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
}
