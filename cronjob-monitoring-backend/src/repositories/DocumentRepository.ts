import Document from '../models/Document';

export class DocumentRepository {
  static acquireSummary = async (queryDate:string):Promise<number> => {
    const count = await Document.count({
      where: {
        change_on: queryDate
      }
    });
    return count
  }

  static acquireByChangedate = async (queryDate:string): Promise<any[]> => {
    const data = await Document.findAll({
      where: {
        change_on: queryDate
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

    return await Document.findAll({
      where: params,
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      }
    })
  }
}