import Education from '../models/Education';

export class EducationRepository {
  static acquireSummary = async (queryDate:string):Promise<number> => {
    const count = await Education.count({
      where: {
        change_on: queryDate
      }
    });
    return count
  }

  static acquireByParams = async (queryDate:any, persNumber:any): Promise<any[]> => {
    
    let params: { change_on?: string, personnel_number?: string } = {}

    if (queryDate) {
      params.change_on = queryDate
    }

    if (persNumber) {
      params.personnel_number = persNumber
    }

    return await Education.findAll({
      where: params,
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
  }

  static acquireByChangedate = async (queryDate:string): Promise<any[]> => {
    const data = await Education.findAll({
      where: {
        change_on: queryDate
      },
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
    return data
  }
}