import Org from '../models/Org';
import { Op } from 'sequelize';
import axios from 'axios';

export class OrgRepository {
  static acquireLeader = async (id:number) => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    const response = await axios.get(`${process.env.AGGREGATOR_API}/api/v1/organization_hierarchy/${id}`, config);
    return response.data.data
  }

  static acquireLeaderPosition = async (empId:number) => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };
    const response = await axios.get(`${process.env.AGGREGATOR_API}/api/v1/employee/${empId}`, config);
    return response.data.data
  }

  static modernizeLeader = async (orgId:number, leaderId:number, leaderPositionId:number):Promise<Boolean> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };
    await axios.put(`${process.env.AGGREGATOR_API}/api/v1/organization_hierarchy/${orgId}`, { leader_id: leaderId, leader_position_id: leaderPositionId, updated_by: 'CRONJOB MONITORING' }, config);
    return true
  }

  static acquireOrgAggregator = async (name:any):Promise<Array<Object>> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params = '/api/v1/organization_hierarchy'

    if (name) {
      params = `/api/v1/organization_hierarchy?name=${name}`
    }

    const response = await axios.get(`${process.env.AGGREGATOR_API}`+params, config);
    return response.data.data
  }

  static acquireSummary = async (queryDate:string):Promise<number> => {
    const count = await Org.count({
      where: {
        change_on: queryDate,
        subtype: {
          [Op.in]: ['A002', 'B002', 'B012']
        }
      }
    });
    return count
  }

  static acquireData = async (queryDate:any, objectId: string|null, type:string):Promise<any> => {
    let filter: { change_on?: string, object_id?:string, subtype: string} = { subtype: type }
    if (queryDate) {
      filter.change_on = queryDate
    }
    
    if (objectId) {
      filter.object_id = objectId
    }
    return await Org.findAll({ where: filter, attributes: { exclude: ['created_at', 'updated_at', 'created_by', 'updated_by'] } })
  }
}