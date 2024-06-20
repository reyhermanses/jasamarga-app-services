import { NextFunction, Request, Response } from "express";
import { RepositoryPic } from "../repositories/RepositoryPic";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";


export class ControllerTicket {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.findAll(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async create(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.create(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async update(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

    static async cancel(req: Request, res: Response) {
        try {
            const { ticket_number} = req.body;

            const getDetailTicket = await RepositoryRegistration.findByRegistrationNumber(ticket_number)

            const status:any = getDetailTicket?.status
            switch(status){
                case 'Registration':
                    return res.status(200).json({
                        status: false,
                        message: "Tiket masi dalam tahap registrasi"
                    })
                case 'Registered':
                    return res.status(200).json({
                        status: false,
                        message: "Ticket already registered"
                    })
                case 'Checkin':
                    return res.status(200).json({
                        status: false,
                        message: "Ticket sudah check in"
                    })
                case 'Cancel':
                    return res.status(200).json({
                        status: false,
                        message: "Tiket telah batal"
                    })
                default:
                    return res.status(200).json({
                        status: false,
                        message: "Unknown registration status"
                    })
            }

        } catch (error) {
            console.log(error)
        }
    }
}