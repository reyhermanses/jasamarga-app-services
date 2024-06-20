import { Request, Response } from 'express';
import moment from 'moment';

import { OmAction319Repository as repository } from '../repositories/OmAction319Repository';
import { createApiResponse } from '../utils/Response';

export class OmAction319Controller {
  static getByParams = async (req: Request, res: Response) => {
    try {
      const data = await repository.acquireByParams(req.query.changedate, req.query.personnel_number);
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error) {
      console.log(error);
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}