import { NextFunction, Request, Response } from "express";
import ModelPic from "../models/ModelPic";
import { RepositoryRegistration } from "./RepositoryRegistration";

import moment from "moment"

export class RepositoryPic {
    static async create(req: Request, res: Response) {
        return await ModelPic.create(req.body);
    }
    static async update(req: Request, res: Response) {
        return await ModelPic.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }
    static async updateActive(id: number, postData: any) {
        return await ModelPic.update(postData, {
            where: {
                id: id
            }
        });
    }
    static async delete(req: Request, res: Response) {
        return await ModelPic.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response) {
        let filterAll: { where?: any, include?: any, order?: any } = {
            order: [['priority', 'ASC']]
        }


        switch (req.query.mode) {
            case "select":
                filterAll.where = {
                    active: true
                }
            const count_tiket = await RepositoryRegistration.findAll(req, res)
            const mapData:any = await ModelPic.findOne(filterAll)
            mapData.dataValues.no_ticket = `${mapData.kd_comp}${count_tiket.length + 1}${moment().format('YYYYMMDD')}`

            return mapData
        }
        return await ModelPic.findAll(filterAll);
    }

    // static async findForSelect()

    static async findById(id: number) {
        return await ModelPic.findByPk(id);
    }

    static async findByCompanyName(company_name: string) {
        return await ModelPic.findOne({
            where: { company_name: company_name }
        })
    }
    static async findByKdComp(kd_comp: string) {
        return await ModelPic.findOne({
            where: { kd_comp: kd_comp }
        })
    }

    static async findByUnitName(unit_name: string) {
        return await ModelPic.findOne({
            where: { unit_kerja_name: unit_name }
        })
    }

    static async findByPriority(priority: string) {
        return await ModelPic.findOne({
            where: { priority: priority }
        })
    }
}