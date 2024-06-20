import { NextFunction, Request, Response } from "express";
import { RepositoryPic } from "../repositories/RepositoryPic";
import { buildApiResponse } from "../utils/Response";


export class ControllerPic {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.findAll(req, res);
            
            res.json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async create(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.create(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async update(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

    static async updateActive(id:number){
        try {
            const postData = {
                active: false
            }
            const data = await RepositoryPic.updateActive(id, postData);
            return data
        } catch (error) {
            console.log(error)
        }
    }

    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryPic.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
}