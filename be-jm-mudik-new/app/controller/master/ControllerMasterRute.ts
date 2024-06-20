import { NextFunction, Request, Response } from "express";
import { RepositoryMasterRute } from "../../repositories/master/RepositoryMasterRute";
import { buildApiResponse } from "../../utils/Response";


export class ControllerMasterRute {
    static async index(req: Request, res: Response) {
        try {
            const data = await RepositoryMasterRute.findAll(req, res);
            res.json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async create(req: Request, res: Response) {
        try {
            const data = await RepositoryMasterRute.create(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

    static async getJalurKabupaten(data: any) {
        try {
            const r = await RepositoryMasterRute.findJalurKabupaten(data)
            return r
        } catch (error) {
            console.log(error)
        }
    }


    static async update(req: Request, res: Response) {
        try {
            const data = await RepositoryMasterRute.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req: Request, res: Response) {
        try {
            const data = await RepositoryMasterRute.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
}