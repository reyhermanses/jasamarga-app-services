import { NextFunction, Request, Response } from "express";
import ModelCheckin from "../models/ModelCheckin";
export class RepositoryCheckin {
    static async create(req: Request, res: Response){
        return await ModelCheckin.create(req.body);
    }
    static async update(req: Request, res: Response){
        return await ModelCheckin.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }
    static async delete(req: Request, res: Response){
        return await ModelCheckin.destroy({
            where: {
                id: req.params.id
            }
        });
    }
    static async findAll(req: Request, res: Response){
        return await ModelCheckin.findAll();
    }

    static async findById(id:number){
        return await ModelCheckin.findByPk(id);
    }

}