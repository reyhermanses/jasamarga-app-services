import { NextFunction, Request, Response } from "express";
import { RepositoryRegistrationMember } from "../repositories/RepositoryRegistrationMember";
import { buildApiResponse } from "../utils/Response";


export class ControllerRegistrationMember {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryRegistrationMember.findAll(req, res);
            res.json(buildApiResponse(true, 200, data));
        } catch (error) {
            console.log(error)
        }
    }
    static async create(req:Request, res:Response) {
        try {

            let ktpErrorResponse = []
            let noHpErrorResponse = []
            let collectinErrorResponse =[]

            if(!req.body.parent_id){
                const checkktp = await RepositoryRegistrationMember.findByNoKtp(req.body.no_ktp)
                if(!req.body.no_ktp){
                   const err = { "ktp": "Ktp tidak boleh kosong"}
                   ktpErrorResponse.push(err)
                }
                if(checkktp){
                    const err = { "ktp": "Ktp sudah terdaftar"}
                    ktpErrorResponse.push(err)
                }

                if(ktpErrorResponse.length !== 0){
                    collectinErrorResponse.push(...ktpErrorResponse)
                }

                const checknohp = await RepositoryRegistrationMember.findByNoHp(req.body.no_hp)
                if(!req.body.no_hp){
                    const err = { "no_hp" : "Nomor hp tidak boleh kosong"}
                    noHpErrorResponse.push(err)
                }

                if(checknohp){
                    const err = { "no_hp" : "Nomor hp sudah terdaftar"}
                    noHpErrorResponse.push(err)
                }

                if(noHpErrorResponse.length !== 0){
                    collectinErrorResponse.push(...noHpErrorResponse)
                }

                if(collectinErrorResponse.length !== 0){
                    return res.status(403).json({errors:collectinErrorResponse})
                }
                
            }

            const data = await RepositoryRegistrationMember.create(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async create_collection(postMemberParent:any, trx:any) {
        try {
            let ktpErrorResponse = []
            let noHpErrorResponse = []
            let collectinErrorResponse =[]

            // if(!postMemberParent.parent_id){
            //     const checkktp = await RepositoryRegistrationMember.findByNoKtp(postMemberParent.no_ktp)
            //     if(!postMemberParent.no_ktp){
            //        const err = { "ktp": "Ktp tidak boleh kosong"}
            //        ktpErrorResponse.push(err)
            //     }
            //     if(checkktp){
            //         const err = { "ktp": "Ktp sudah terdaftar"}
            //         ktpErrorResponse.push(err)
            //     }

            //     if(ktpErrorResponse.length !== 0){
            //         collectinErrorResponse.push(...ktpErrorResponse)
            //     }

            //     const checknohp = await RepositoryRegistrationMember.findByNoHp(postMemberParent.no_hp)
            //     if(!postMemberParent.no_hp){
            //         const err = { "no_hp" : "Nomor hp tidak boleh kosong"}
            //         noHpErrorResponse.push(err)
            //     }

            //     if(checknohp){
            //         const err = { "no_hp" : "Nomor hp sudah terdaftar"}
            //         noHpErrorResponse.push(err)
            //     }

            //     if(noHpErrorResponse.length !== 0){
            //         collectinErrorResponse.push(...noHpErrorResponse)
            //     }

            //     if(collectinErrorResponse.length !== 0){
            //         return {errors:collectinErrorResponse}
            //     }
                
            // }

            const data = await RepositoryRegistrationMember.create_collection(postMemberParent);
            return data;

        } catch (error) {
            // await trx.rollback();
            console.log(error)
        }
    }
    static async update(req:Request, res:Response) {
        try {
            const data = await RepositoryRegistrationMember.update(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryRegistrationMember.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
}