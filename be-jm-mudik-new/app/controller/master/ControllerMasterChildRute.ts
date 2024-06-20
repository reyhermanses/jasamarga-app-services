import { NextFunction, Request, Response } from "express";
import { RepositoryMasterChildRute } from "../../repositories/master/RepositoryMasterChildRute";
import { buildApiResponse } from "../../utils/Response";


export class ControllerMasterChildRute {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterChildRute.findAll(req, res);
            res.json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async create(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterChildRute.create(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

    static async getJalurKecamatan(data:any){
        try {
            const r = await RepositoryMasterChildRute.findJalurKecamatan(data)
            return r
        } catch (error) {
            console.log(error)
        }
    }

    static async update(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterChildRute.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterChildRute.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
}