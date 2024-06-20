import { NextFunction, Request, Response } from "express";
import { RepositoryMasterTanggalMudik } from "../../repositories/master/RepositoryMasterTanggalMudik";
import { buildApiResponse } from "../../utils/Response";


export class ControllerMasterTanggalMudik {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterTanggalMudik.findAll(req, res);
            res.json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async create(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterTanggalMudik.create(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async update(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterTanggalMudik.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryMasterTanggalMudik.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
}