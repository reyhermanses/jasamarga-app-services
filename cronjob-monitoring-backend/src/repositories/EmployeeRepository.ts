import axios from "axios";

export class EmployeeRepository {
  static acquireEmployeeByNpp = async (npp:any):Promise<Array<Object>> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params = '/api/v1/employee'

    if (npp) {
      params = `/api/v1/employee?npp=${npp}`
    }
    const response = await axios.get(`${process.env.AGGREGATOR_API}`+params, config);
    return response.data.data
  }
}