import { NextFunction, Request, Response } from "express";
import ModelBus from "../models/ModelBus";
import ModelBusMember from "../models/ModelBusMember";

ModelBus.hasMany(ModelBusMember, {
    as: "passengers",
    foreignKey: "bus_id",
});

export class RepositoryBus {
    static async create(req: Request, res: Response){
        return await ModelBus.create(req.body);
    }
    static async update(id:number, data:any){
        return await ModelBus.update(data, {
            where: {
                id: id
            }
        });
    }
    static async delete(req: Request, res: Response){
        return await ModelBus.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response){

        let filterAll: {where?:any, attributes?:any, include?:any, order?:any} = {
            include: [
                {
                    model: ModelBusMember,
                    as: "passengers",
                }
            ],
            order: [['nomor', 'ASC']]
        }
        if(req.query.active){
            filterAll.where = {
                active: req.query.active
            }
        }
        return await ModelBus.findAll(filterAll);
    }

    static async findById(id:number) {
        return await ModelBus.findByPk(id)
    }

    static async findOneById(id:number){
        return await ModelBus.findOne({
            where: {
                id: id
            }
        });
    }

    static async findByRuteIdChildRuteId(rute_id:string, child_rute_id:string){
        return await ModelBus.findOne({
            where: {
                master_rute_id: rute_id,
                master_child_rute_id: child_rute_id,
                status: 'Available'
            }
        })
    }

    static async findAllByRuteIdChildRuteId(rute_id:number, child_rute_id:number){
        return await ModelBus.findAll({
            where: {
                master_rute_id: rute_id,
                master_child_rute_id: child_rute_id,
                status: 'Available'
            },
            order: [["sisa_muatan","ASC"]]
        })
    }

    static async countBus(){
        return await ModelBus.count();
    }
}