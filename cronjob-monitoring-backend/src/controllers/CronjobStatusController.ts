import { Request, Response } from "express";

import { createApiResponse } from '../utils/Response';
import { CronjobStatusRepository } from "../repositories/CronjobStatusRepository";

export class cronjobStatusController {
  static upsert = async (req: Request, res: Response) => {
    try {
      
      const changeData: string = req.body.changedate
      const statusData: boolean = req.body.status
      
      const checkData = await CronjobStatusRepository.upsert(changeData, statusData)

      return res.status(200).send(createApiResponse("success", 200, checkData))
    } catch (error) {
      console.log(error);
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}