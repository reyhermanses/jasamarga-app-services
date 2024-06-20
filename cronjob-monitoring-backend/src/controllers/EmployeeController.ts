import { Request, Response} from 'express';

import { EmployeeRepository as repository } from "../repositories/EmployeeRepository";
import { createApiResponse } from '../utils/Response';

export class EmployeeController {
  static getEmployeeByNpp = async (req: Request, res: Response) => {
    try {
      const data:any[] = await repository.acquireEmployeeByNpp(req.query.npp)
      const transformedArray = data.map((obj) => ({
        ...obj,
        name: `(${obj.position[0].npp} - ${obj.position[0].position_detail.company_position.kd_comp} - ${obj.name})`,
      }));
      return res.status(200).send(createApiResponse("success", 200, transformedArray))
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: `${error}`});
    }
  }
}