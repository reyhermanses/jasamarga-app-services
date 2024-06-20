import Payslip from '../models/Payslip';

export class PayslipRepository {
	static acquireByParams = async (period:any, persNumber:any): Promise<any[]> => {
		
		let params: { Periode?: string, Personnel_No?: string } = {}

		if (period) {
			params.Periode = period
		}

		if (persNumber) {
			params.Personnel_No = persNumber
		}
		
		return await Payslip.findAll({
			where: params,
			attributes: {
				exclude: ["id", "created_at", "updated_at", "created_by", "updated_by"],
			}
		})
	}

	static acquireByChangedate = async (queryDate:string): Promise<any[]> => {
		const data = await Payslip.findAll({
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