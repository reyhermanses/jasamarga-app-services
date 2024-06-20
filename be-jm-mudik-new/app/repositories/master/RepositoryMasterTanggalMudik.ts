import { NextFunction, Request, Response } from "express";
import ModelMasterTanggalMudik from "../../models/ModelMasterTanggalMudik";
export class RepositoryMasterTanggalMudik {
    static async create(req: Request, res: Response){
        return await ModelMasterTanggalMudik.create(req.body);
    }
    static async update(req: Request, res: Response){
        return await ModelMasterTanggalMudik.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }
    static async delete(req: Request, res: Response){
        return await ModelMasterTanggalMudik.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response){
        let filterAll: {where?:any, attributes?:any, include?:any} = {}
        if(req.query.active){
            filterAll.where = {
                active: req.query.active
            }
        }
        return await ModelMasterTanggalMudik.findAll(filterAll);
    }

    static async findById(id:number) {
        return await ModelMasterTanggalMudik.findByPk(id)
    }
}