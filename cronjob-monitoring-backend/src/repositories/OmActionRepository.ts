import OmAction from '../models/OmAction';

export class OmActionRepository {
  static acquireSummary = async (queryDate:string):Promise<number> => {
    const count = await OmAction.count({
      where: {
        change_on: queryDate,
        end_date: '99991231'
      }
    });
    return count
  }

  static acquireByChangedate = async (queryDate:string): Promise<any[]> => {
    const data = await OmAction.findAll({
      where: {
        change_on: queryDate,
        end_date: '99991231'
      }
    })
    return data
  }

  static acquireByParams = async (queryDate:any, persNumber:any): Promise<any[]> => {
    
    let params: { change_on?: string, personnel_number?: string } = {}

    if (queryDate) {
      params.change_on = queryDate
    }

    if (persNumber) {
      params.personnel_number = persNumber
    }

    return await OmAction.findAll({
      where: params,
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
  }
}