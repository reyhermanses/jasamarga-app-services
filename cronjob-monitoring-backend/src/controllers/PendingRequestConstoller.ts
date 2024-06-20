import { Request, Response } from 'express';

import { PendingRequestRepository as repository } from '../repositories/PendingRequestRepository';
import { createApiResponse } from '../utils/Response';

export class PendingRequestController {
  static getPendingRequest = async (req: Request, res: Response) => {
    try {
      const data = await repository.acquirePendingRequest()
      return res.status(200).send(createApiResponse('success', 200, data.data))
    } catch (error: any) {
      console.log(error)
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}