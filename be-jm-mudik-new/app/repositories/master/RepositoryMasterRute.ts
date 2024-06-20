import { NextFunction, Request, Response } from "express";
import ModelMasterRute from "../../models/ModelMasterRute";
import { Op } from "sequelize";
import ModelMasterKabupaten from "../../models/ModelMasterKabupaten";
import ModelMasterChildRute from "../../models/ModelMasterChildRute";
import ModelMasterKecamatan from "../../models/ModelMasterKecamatan";
export class RepositoryMasterRute {
    static async create(req: Request, res: Response){
        if(req.body.parent_id){
            const countRouteLevel = await ModelMasterRute.findAll({where: {parent_id: req.body.parent_id}})
            if(countRouteLevel.length > 0){
                req.body.route_level = countRouteLevel.length + 2;
            }
        }
        return await ModelMasterRute.create(req.body);
    }
    static async update(req: Request, res: Response){
        return await ModelMasterRute.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }
    static async delete(req: Request, res: Response){
        return await ModelMasterRute.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response){
        let filterAll: {where?:any, include?:any} = {
            include: [
                {
                    model: ModelMasterKabupaten,
                    as: "kabupaten",
                },
                {
                    model: ModelMasterChildRute,
                    as: "kota_tujuan",
                    include: [
                        {
                            model: ModelMasterKecamatan,
                            as: "kecamatan",
                            required: true
                        }
                    ]
                }
            ]
        }
        if(req.query.active){
            filterAll.where = {
                active: req.query.active
            }
        }

        if(req.query.route){
            filterAll.where = {
                route: req.query.route
            }
        }
        return await ModelMasterRute.findAll(filterAll);
    }

    static async findById(id:number){
        return await ModelMasterRute.findByPk(id)
    }

    static async findJalurKabupaten(data:any) {
        return await ModelMasterRute.findOne({
            where: {
                [Op.and]: [
                    {
                        route : data.jalur
                    },
                    {
                        kabupaten_id: data.kabupaten_id
                    }
                ]
            }
        });
    }
}