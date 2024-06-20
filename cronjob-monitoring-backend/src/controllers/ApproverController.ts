import { Request, Response} from 'express';
import moment from 'moment';

import { ApproverRepository as repository } from '../repositories/ApproverRepository';
import { createApiResponse } from '../utils/Response';

export class ApproverController {
  static  getAllApprover = async (req: Request, res: Response) => {
    try {
      let filter = {}
      let dateNow = Date.now();
      let dateParse = moment(dateNow).subtract(1, "days").format('YYYYMMDD');
      if(req.query.change_on){
        filter = {
          change_on : dateParse
        }
      }
      const approvers = await repository.getAll(filter);
      res.status(200).send(createApiResponse("success", 200, approvers))
    } catch (error) {
      console.log(error)
      res.status(500).send({error: `${error}`});
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

  static getByParams = async (req: Request, res: Response) => {
    try {
      const data = await repository.acquireByParams(req.query.changedate, req.query.org_id);
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error) {
      console.log(error);
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}