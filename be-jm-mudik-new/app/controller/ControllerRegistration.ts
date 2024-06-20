import { NextFunction, Request, Response } from "express";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";
import { buildApiResponse } from "../utils/Response";


export class ControllerRegistration {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryRegistration.findAll(req, res);
            res.json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async create(req:Request, res:Response) {
        try {
            req.body.status = 'Registration'
            const data = await RepositoryRegistration.create(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

    static async create_collection(postData:any,  trx:any){
        try {

            postData.status = 'Registration'
            const data = await RepositoryRegistration.create_collection(postData);
            return data

        } catch (error) {
            // trx.rollback();
            console.log(error);
        }
    }

    static async update(req:Request, res:Response) {
        try {
            const data = await RepositoryRegistration.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryRegistration.delete(req, res);
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
                        message: "Tiket masi dalam proses registrasi"
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