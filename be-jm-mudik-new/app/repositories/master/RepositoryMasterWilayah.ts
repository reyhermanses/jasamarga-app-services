import { NextFunction, Request, Response } from "express";
import ModelMasterProvinsi from "../../models/ModelMasterProvinsi";
import ModelMasterKabupaten from "../../models/ModelMasterKabupaten";
import ModelMasterKecamatan from "../../models/ModelMasterKecamatan";

export class RepositoryMasterWilayah {
    static async acquireAllProvinsi (req: Request, res:Response) {
        return await ModelMasterProvinsi.findAll();
    }
    static async acquireAllKabupaten (req: Request, res: Response) {
        let filter: {where?:any} = {}

        if(req.query.provinsi_id || req.body.provinsi_id){
            filter.where = {
                provinsi_id: req.query.provinsi_id || req.body.provinsi_id
            }
        }

        return await ModelMasterKabupaten.findAll(filter);
    }
    
    static async acquireKabupatenById (kabupaten_id: number) {
        return await ModelMasterKabupaten.findOne({
            where: {
                id: kabupaten_id
            }
        });
    }
    static async acquireAllKecamatan (req: Request, res: Response) {
        let filter: {where?:any} = {}

        if(req.query.kabupaten_id || req.body.kabupaten_id){
            filter.where = {
                kabupaten_id: req.query.kabupaten_id || req.body.kabupaten_id
            }
        }

        return await ModelMasterKecamatan.findAll(filter);
    }

    static async acquireKecamatanById (kecamatan_id: number) {
        return await ModelMasterKecamatan.findOne({
            where: {
                id: kecamatan_id
            }
        });
    }
}