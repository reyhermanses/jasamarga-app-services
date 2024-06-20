import { NextFunction, Request, Response } from "express";
import { RepositoryMasterWilayah } from "../../repositories/master/RepositoryMasterWilayah";
import { buildApiResponse } from "../../utils/Response";

export class ControllerMasterWilayah {
    static async getAllProvinsi(req: Request, res: Response){
        try {
            const data = await RepositoryMasterWilayah.acquireAllProvinsi(req, res)
            res.status(200).json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async getAllKabupaten(req: Request, res: Response){
        try {
            const data = await RepositoryMasterWilayah.acquireAllKabupaten(req, res)
            res.status(200).json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async getKabupatenById(kabupaten_id:number){
        try {
            return await RepositoryMasterWilayah.acquireKabupatenById(kabupaten_id)
        } catch (error) {
            console.log(error)
        }
    }
    static async getAllKecamatan(req: Request, res: Response){
        try {
            const data = await RepositoryMasterWilayah.acquireAllKecamatan(req, res)
            res.status(200).json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }

    static async getKecamatanById(kecamatan_id:number){
        try {
            return await RepositoryMasterWilayah.acquireKecamatanById(kecamatan_id)
        } catch (error) {
            console.log(error)
        }
    }
}