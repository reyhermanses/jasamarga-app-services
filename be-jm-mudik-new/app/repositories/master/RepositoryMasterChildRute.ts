import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import ModelMasterKabupaten from "../../models/ModelMasterKabupaten";
import ModelMasterChildRute from "../../models/ModelMasterChildRute";
import ModelMasterRute from "../../models/ModelMasterRute";
import ModelMasterKecamatan from "../../models/ModelMasterKecamatan";

ModelMasterChildRute.belongsTo(ModelMasterRute, {
    as: "rute",
    foreignKey: "rute_id",
});

// ModelMasterChildRute.belongsTo(ModelMasterKecamatan, {
//     as: "kecamatan",
//     foreignKey: "kecamatan_id",
// });

export class RepositoryMasterChildRute {
    static async create(req: Request, res: Response){
        return await ModelMasterChildRute.create(req.body);
    }
    static async update(req: Request, res: Response){
        return await ModelMasterChildRute.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }
    static async delete(req: Request, res: Response){
        return await ModelMasterChildRute.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response){
        let filterAll: {where?:any, include?:any} = {
            include: [
                {
                    model: ModelMasterKecamatan,
                    as: "kecamatan"
                },
                {
                    model: ModelMasterRute,
                    as: "rute",
                    include: [
                        {
                            model: ModelMasterKabupaten,
                            as: "kabupaten"
                        }
                    ]
                }
            ]
        }
        if(req.query.is_show){
            filterAll.where = {
                is_show: req.body.is_show
            }
        }
        if(req.query.rute_id) {
            filterAll.where = {
                rute_id: req.query.rute_id
            }
        }
        return await ModelMasterChildRute.findAll(filterAll);
    }

    static async findById(id: number){
        return await ModelMasterChildRute.findByPk(id)
    }

    static async findJalurKecamatan(data:any) {
        return await ModelMasterChildRute.findOne({
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