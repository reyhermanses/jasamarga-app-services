import { NextFunction, Request, Response } from "express";
import { RepositoryPic } from "../repositories/RepositoryPic";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";
import { RepositoryRegistrationMember } from "../repositories/RepositoryRegistrationMember";
import { RepositoryBusMember } from "../repositories/RepositoryBusMember";
import { RepositoryBus } from "../repositories/RepositoryBus";
import { buildApiResponse } from "../utils/Response";


export class ControllerCheckin {
    static async checkin(req:Request, res:Response){
        try {
            const { ticket_number } = req.body;
            const data = {
                status: 'Checkin'
            }
            await RepositoryRegistration.updateByTicketNumber(ticket_number, data)
            res.status(200).send(`Checkin berhasil`)
        } catch (error) {
            console.log(error)
        }
    }
    static async cancel(req:Request, res: Response){
        try {
            const { ticket_number } = req.body;
            const dataRegistration:any = await RepositoryRegistration.findByRegistrationNumber(ticket_number)
            dataRegistration.status = 'Cancel';
            dataRegistration.save();
            const dataBusMember:any = await RepositoryBusMember.findRegistrationMemberWithBusMemberByRegistrationId(dataRegistration.id)
            const clearDataBusMember = JSON.parse(JSON.stringify(dataBusMember))
            const dataBus:any = await RepositoryBus.findById(clearDataBusMember[0].bus_id)
            dataBus.sisa_muatan = parseInt(dataBus.sisa_muatan) + dataBusMember.length;
            if(dataBus.status === 'Unavailable'){
                dataBus.status = 'Available'
                dataBus.save();
                return
            }
            dataBus.save();
            return res.status(201).json(`No tiket ${ticket_number} telah dibatalkan`)
        } catch (error) {
            console.log(error)
        }
    }

    static async getAllCheckinPassengers(req:Request, res:Response){
        try {
            const data = await RepositoryBusMember.findAll(req, res);
            res.status(200).json(buildApiResponse(true, 200, data))
        } catch (error:any) {
            res.status(error.statusCode).json({message:error.message})
        }
    }
}