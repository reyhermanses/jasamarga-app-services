import Address from '../models/Address';

export class AddressRepository {
  static acquireSummary = async (queryDate:string):Promise<number> => {
    const count = await Address.count({
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

    return await Address.findAll({
      where: params,
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
  }

  static acquireByChangedate = async (queryDate:string): Promise<any[]> => {
    const data = await Address.findAll({
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