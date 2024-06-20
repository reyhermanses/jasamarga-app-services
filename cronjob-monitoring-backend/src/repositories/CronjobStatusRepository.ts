import CronjobStatus from "../models/CronjobStatus";

export class CronjobStatusRepository {
  static upsert = async (queryDate:string, status: boolean):Promise<object> => {
    const dataStatus = await CronjobStatus.findOne({ where: { changedate: queryDate } })

    if (dataStatus) {
      return dataStatus.update({
        updated_by: 'cronjob_monitoring',
        status: status
      })
    }

    return await CronjobStatus.create({ changedate: queryDate, status: status, created_by: 'cronjob_monitoring' })
  }

  static acquireByChangedate = async (queryDate: string):Promise<string> => {
    const data = await CronjobStatus.findOne({ where: { changedate: queryDate } })

    let message = 'failed'

    if (data && data.status) {
      message = 'success'
    }
    return message
  }
}