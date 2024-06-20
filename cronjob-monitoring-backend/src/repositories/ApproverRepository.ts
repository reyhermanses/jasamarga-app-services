import Approver from '../models/Approver';

export class ApproverRepository {
  static acquireSummary = async (queryDate:string):Promise<number> => {
    const count = await Approver.count({
      where: {
        change_on: queryDate
      }
    });
    return count
  }

  static async getAll(filter: any){
    let filterAll = {};
    if(filter){
      filterAll = {
        where: {
          change_on : filter.change_on
        }
      }
    }
    return await Approver.findAll(filterAll)
  }

  static acquireByChangedate = async (queryDate:string): Promise<any[]> => {
    const data = await Approver.findAll({
      where: {
        change_on: queryDate
      },
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
    return data
  }

  static acquireByParams = async (queryDate:any, orgId:any): Promise<any[]> => {
    
    let params: { change_on?: string, org_approver?: string } = {}

    if (queryDate) {
      params.change_on = queryDate
    }

    if (orgId) {
      params.org_approver = orgId
    }

    return await Approver.findAll({
      where: params,
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
  }
}