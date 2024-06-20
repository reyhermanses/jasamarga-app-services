import { Request, Response } from 'express';
import moment from 'moment';

import { PayslipRepository as repository } from '../repositories/PayslipRepository';
import { createApiResponse } from '../utils/Response';

export class PayslipController {
  static getByParams = async (req: Request, res: Response) => {
    try {
      const data = await repository.acquireByParams(req.query.period, req.query.personnel_number);
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error) {
      console.log(error);
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}