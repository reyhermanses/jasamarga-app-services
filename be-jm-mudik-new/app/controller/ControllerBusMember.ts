import { NextFunction, Request, Response } from "express";
import { RepositoryBusMember } from "../repositories/RepositoryBusMember";
import { RepositoryRegistrationMember } from "../repositories/RepositoryRegistrationMember";


export class ControllerBusMember {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryBusMember.findAll(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async create(bus_id: any, ticket_number:string) {
        try {
            const mapData:any = [];
            const data = await RepositoryRegistrationMember.findAllMemberByTickets(ticket_number)
            data.map(async(d) => {
                const m = {
                    registration_member_id: d.id,
                    bus_id: bus_id,
                    active: true
                }
                // mapData.push(m);
                mapData.push(await RepositoryBusMember.create(m));
            })
            return mapData;
        } catch (error) {
            console.log(error)
        }
    }
    static async create_multiple(req: Request, res:Response){

    }
    static async update(req:Request, res:Response) {
        try {
            const data = await RepositoryBusMember.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryBusMember.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

    static async countMember(req:Request, res: Response) {
        try {
            const data = await RepositoryBusMember.countMemberByPic(req.body.kd_comp);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error)
        }
    }
}