import axios from 'axios';

export class PendingRequestRepository {
  static acquirePendingRequest = async ():Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/pending-requests`, config);
    return response.data
  }
}