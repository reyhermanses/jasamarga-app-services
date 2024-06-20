import { NextFunction, Request, Response } from "express";
import ModelBus from "../models/ModelBus";
import ModelBusMember from "../models/ModelBusMember";
import ModelRegistrationMember from "../models/ModelRegistrationMember";
import ModelRegistration from "../models/ModelRegistration";
import ModelPic from "../models/ModelPic";

ModelBusMember.belongsTo(ModelBus, {
    as: "bus",
    foreignKey: "bus_id",
  });

export class RepositoryBusMember {
    static async create(data:any){
        return await ModelBusMember.create(data);
    }
    static async update(req: Request, res: Response){
        return await ModelBusMember.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }
    static async delete(req: Request, res: Response){
        return await ModelBusMember.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response){
        let filterAll: {where?:any, attributes?:any, include?:any} = {
            include: [
                {
                    model: ModelBus,
                    as: "bus"
                },
                {
                    model: ModelRegistrationMember,
                    as: "passenger",
                    include: [
                        {
                            model: ModelRegistration,
                            as: "tiket",
                            include: [
                                {
                                     model: ModelPic,
                                     as: "pic"
                                }
                            ]
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
        return await ModelBusMember.findAll(filterAll);
    }

    static async findById(id:number) {
        return await ModelBusMember.findByPk(id)
    }

    static async findByBusId(id:number) {
        return await ModelBusMember.findAll({
            where: {
                bus_id: id
            }
        });
    }

    static async findAndCountByBusId(bus_id:number) {
        return await ModelBusMember.findAndCountAll({
            where: {
                bus_id: bus_id
            }
        });
    }

    static async countMemberByPic(kd_comp: string){
        let filterAll: {where?:any, attributes?:any, include?:any} = {
            include: [
                {
                    model: ModelBus,
                    as: "bus"
                },
                {
                    model: ModelRegistrationMember,
                    as: "passenger",
                    required: true,
                    include: [
                        {
                            model: ModelRegistration,
                            as: "tiket",
                            required: true,
                            include: [
                                {
                                     model: ModelPic,
                                     as: "pic",
                                     where: {kd_comp: kd_comp},
                                     required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        return await ModelBusMember.count(filterAll);
    }

    static async findRegistrationMemberWithBusMemberByRegistrationId(registration_id: number){
        let filterAll: {where?:any, attributes?:any, include?:any} = {
            include: [
                {
                    model: ModelRegistrationMember,
                    as: "passenger",
                    required: true,
                    where: {
                        registration_id: registration_id
                    }
                }
            ]
        }
        return await ModelBusMember.findAll(filterAll);
    }
}