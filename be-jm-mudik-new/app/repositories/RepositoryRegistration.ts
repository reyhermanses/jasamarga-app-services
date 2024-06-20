import { NextFunction, Request, Response } from "express";
import ModelRegistration from "../models/ModelRegistration";
import ModelPic from "../models/ModelPic";
import ModelMasterRute from "../models/ModelMasterRute";
import ModelMasterChildRute from "../models/ModelMasterChildRute";
import ModelMasterKabupaten from "../models/ModelMasterKabupaten";
import ModelMasterKecamatan from "../models/ModelMasterKecamatan";
export class RepositoryRegistration {
    static async create(req: Request, res: Response){
        return await ModelRegistration.create(req.body);
    }
    static async create_collection(data:any){
        return await ModelRegistration.create(data);
    }
    static async update(req: Request, res: Response){
        return await ModelRegistration.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }
    static async updateByTicketNumber(ticket_number: string, postData: any){
        return await ModelRegistration.update(postData, {
            where: {
                registration_number: ticket_number
            }
        });
    }
    static async delete(req: Request, res: Response){
        return await ModelRegistration.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response){
        let filterAll: {where?:any, attributes?:any, include?:any} = {
            include: [
                {
                    model: ModelPic,
                    as: "pic"
                },
                {
                    model: ModelMasterRute,
                    as: "kota_tujuan_akhir",
                    include: [
                        {
                            model: ModelMasterKabupaten,
                            as: "kabupaten",
                            required: true
                        }
                    ]
                }
                ,
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
        return await ModelRegistration.findAll(filterAll);
    }

    static async findById(id:number){
        return await ModelRegistration.findByPk(id);
    }

    static async findByPicId(pic_id:number){
        return await ModelRegistration.findOne({
            where: {
                pic_id: pic_id
            }
        });
    }

    static async findByRegistrationNumber(registration_number:string){
        return await ModelRegistration.findOne({
            where: {
                registration_number: registration_number
            }
        })
    }

    static async findByRegistrationNumberWithPic(registration_number:string){
        return await ModelRegistration.findOne({
            include: [
                {
                    model: ModelPic,
                    as: "pic"
                }
            ],
            where: {
                registration_number: registration_number
            }
        })
    }
}