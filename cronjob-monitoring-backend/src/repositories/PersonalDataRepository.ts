import PersonalData from '../models/PersonalData';

export class PersonalDataRepository {
  static acquireSummary = async (queryDate:string):Promise<number> => {
    const count = await PersonalData.count({
      where: {
        change_on: queryDate
      }
    });
    return count
  }

  static acquireByChangedate = async (queryDate:string): Promise<any[]> => {
    const data = await PersonalData.findAll({
      where: {
        change_on: queryDate
      },
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
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

    return await PersonalData.findAll({
      where: params,
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
  }
}