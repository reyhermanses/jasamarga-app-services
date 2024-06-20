import { Request, Response } from 'express';
import moment from 'moment';

import { FamilyRepository as repository } from '../repositories/FamilyRepository';
import { createApiResponse } from '../utils/Response';

export class FamilyController {
  static getByParams = async (req: Request, res: Response) => {
    try {
      const data = await repository.acquireByParams(req.query.changedate, req.query.personnel_number);
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error) {
      console.log(error);
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }

  static getByChangedate = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const data = await repository.acquireByChangedate(dateParse);
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error) {
      console.log(error);
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}