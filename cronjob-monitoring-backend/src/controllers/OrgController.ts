import { Request, Response} from 'express';
import moment from 'moment';

import { OrgRepository as repository } from "../repositories/OrgRepository";
import { createApiResponse } from '../utils/Response';

export class OrgController {
  static getLeader = async (req: Request, res: Response) => {
    try {
      const data = await repository.acquireLeader(parseInt(req.params.id))
      return res.status(200).send(createApiResponse("success", 200, data))
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: `${error}`});
    }
  }

  static updateLeader = async (req: Request, res: Response) => {
    try {
      const searchPosition = await repository.acquireLeaderPosition(req.body.leader_id)
      const data =  await repository.modernizeLeader(parseInt(req.params.id), req.body.leader_id, searchPosition.position[0].position_detail.id)
      return res.status(200).send(createApiResponse("success update data", 200, data))
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: `${error}`});
    }
  }

  static getOrgAggregator = async (req: Request, res: Response) => {
    try {
      const data = await repository.acquireOrgAggregator(req.query.name)
      return res.status(200).send(createApiResponse("success", 200, data))
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: `${error}`});
    }
  }

  static getAllOrg = async (req: Request, res: Response) => {
    try {
      let dateParse = null;
      if(req.query.changedate){
        dateParse = req.query.changedate.toString()
      }

      if (!req.query.changedate && !req.query.object_id) {
        dateParse = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');
      }

      let objectId = null;

      if (req.query.object_id) {
        objectId = req.query.object_id.toString();
      }

      let subtype:string = 'B012'

      if (req.query.subtype) {
        subtype = req.query.subtype.toString()
      }
      const orgs = await repository.acquireData(dateParse, objectId, subtype);
      res.status(200).send(createApiResponse("success", 200, orgs))
    } catch (error) {
      console.log(error)
      res.status(500).send({error: `${error}`});
    }
  }
}