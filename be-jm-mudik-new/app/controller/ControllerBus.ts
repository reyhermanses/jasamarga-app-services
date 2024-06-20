import { NextFunction, Request, Response, response } from "express";
import { RepositoryBus } from "../repositories/RepositoryBus";
import { RepositoryBusMember } from "../repositories/RepositoryBusMember";
import { RepositoryRegistrationMember } from "../repositories/RepositoryRegistrationMember";
import { ControllerBusMember } from "./ControllerBusMember";
import ModelBus from "../models/ModelBus";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";
import { ControllerRegistration } from "./ControllerRegistration";
import { ControllerPic } from "./ControllerPic";
import { RepositoryPic } from "../repositories/RepositoryPic";

enum RegistrationStatus {
    Registration = 'Registration',
    Registered = 'Registered',
    Checkin = 'Checkin',
    Cancel = 'Cancel'
}


export class ControllerBus {
    static async index(req:Request, res:Response) {
        try {
            const data = await RepositoryBus.findAll(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

    static async create(req:Request, res:Response) {
        try {
            req.body.muatan = 6 // static value
            req.body.active = true // static value
            req.body.status = "Available" // static value
            req.body.nomor = 0; //static value
            req.body.sisa_muatan = 0 //static value

            // membuat nomor bust
            const numberingBus = await RepositoryBus.countBus();

            //get rute id dan child rute id
            const getRuteByTicket = await RepositoryRegistration.findByRegistrationNumber(req.body.ticket_number)

            // set rute id dan child rute id to req body
            req.body.master_rute_id = getRuteByTicket?.dataValues.master_rute_id;
            req.body.master_child_rute_id = getRuteByTicket?.dataValues.master_child_rute_id
            
            const jumlahMemberBasedOnTickets = await RepositoryRegistrationMember.findAllMemberByTickets(req.body.ticket_number)

            //logic pemetaan passanger ke bus yang sudah tersedia
            const checkAvailability = await ControllerBus.checkExistingBus(getRuteByTicket?.dataValues.master_rute_id, getRuteByTicket?.dataValues.master_child_rute_id, req.body.ticket_number, jumlahMemberBasedOnTickets.length)
            if(checkAvailability?.status) return res.status(200).json(`Successfully registered`);

            //start create new bus
            const data:any = new ModelBus(req.body);
            data.nomor = numberingBus + 1;
            data.sisa_muatan = data.muatan - jumlahMemberBasedOnTickets.length;
            await data.save();
            // end create new bus

            // masukkan passnger ke dalam bus
            await ControllerBusMember.create(data.id, req.body.ticket_number)
            
            // buat status nomor tiket jadi registered
            await ControllerBus.updateStatuTicket(req.body.ticket_number, "Registered");

            // update status active pic
            await ControllerBus.updateStatusPic(req.body.ticket_number, jumlahMemberBasedOnTickets.length);

            res.status(200).json('Successfully created new bus');

        } catch (error) {
            console.log(error);
        }
    }
    
    static async create_collection(noTiket:string) {
        try {

            const postDataBus:any = {
                muatan : 4, // static value
                active : true, // static value
                status : "Available", // static value
                nomor : 0, //static value
                sisa_muatan : 0 //static value
            }

            // membuat nomor bust
            const numberingBus = await RepositoryBus.countBus();

            //get rute id dan child rute id
            const getRuteByTicket = await RepositoryRegistration.findByRegistrationNumber(noTiket)

            // set rute id dan child rute id to req body
            postDataBus.master_rute_id = getRuteByTicket?.dataValues.master_rute_id;
            postDataBus.master_child_rute_id = getRuteByTicket?.dataValues.master_child_rute_id
            
            const jumlahMemberBasedOnTickets:any =  await RepositoryRegistrationMember.findAllMemberByTickets(noTiket)

            //check jika status available tapi muatan sudah tidak mencukupi

            const jumlahMuatan:any = await RepositoryBus.findByRuteIdChildRuteId(getRuteByTicket?.dataValues.master_rute_id, getRuteByTicket?.dataValues.master_child_rute_id)

            //logic pemetaan passanger ke bus yang sudah tersedia

            // if(jumlahMemberBasedOnTickets.length < jumlahMuatan?.sisa_muatan ){
                const checkAvailability = await ControllerBus.checkExistingBus(getRuteByTicket?.dataValues.master_rute_id, getRuteByTicket?.dataValues.master_child_rute_id, noTiket, jumlahMemberBasedOnTickets.length)
                if(checkAvailability?.status) return checkAvailability;
            // }

            //start create new bus
            const data:any = new ModelBus(postDataBus);
            data.nomor = numberingBus + 1;
            data.sisa_muatan = data.muatan - jumlahMemberBasedOnTickets.length;
            await data.save();
            // end create new bus

            // masukkan passnger ke dalam bus
            const dataBusMember = await ControllerBusMember.create(data.id, noTiket)
            
            // buat status nomor tiket jadi registered
            await ControllerBus.updateStatuTicket(noTiket, "Registered");

            // update status active pic
            await ControllerBus.updateStatusPic(noTiket, jumlahMemberBasedOnTickets.length);

            // res.status(200).json('Successfully created new bus');

            return dataBusMember

        } catch (error) {
            console.log(error);
        }
    }

    static async updateStatusPic(ticket_number:string, qutoaMember: number){
        try {
            const dataRegistration:any = await RepositoryRegistration.findByRegistrationNumberWithPic(ticket_number)
            const dataPic:any = await RepositoryPic.findByKdComp(dataRegistration?.pic.kd_comp)
            const dataCountBusMemberByKdComp:any = await RepositoryBusMember.countMemberByPic(dataRegistration?.pic.kd_comp)

            if(dataCountBusMemberByKdComp >= dataPic.muatan){
                await ControllerPic.updateActive(dataRegistration?.pic_id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    static async checkExistingBus (master_rute_id:number, master_child_rute_id:number, ticket_number:string, count_member:number){
        try {
            const result:{status?:boolean} = { status: false}
            const data: any = await RepositoryBus.findAllByRuteIdChildRuteId(master_rute_id, master_child_rute_id);

            if(data.length > 0){
                for(const bus of data){
                    // console.log(bus.id);
                    if (bus.sisa_muatan !== 0 && count_member <= bus.sisa_muatan) {

                        const updatedData = { sisa_muatan: bus.sisa_muatan - count_member };
              
                        // Update the bus directly using ID
                        await RepositoryBus.update(bus.id, updatedData);

                        await ControllerBusMember.create(bus.id, ticket_number)

                        // Update status bus
                        const currentBusData = await RepositoryBus.findById(bus.id);
                        const clearData = JSON.parse(JSON.stringify(currentBusData));
                        if(parseInt(clearData.sisa_muatan) === 0){
                            const updateData = { status: "Unavailable" }
                            await RepositoryBus.update(bus.id, updateData);
                        }
                        // End update status bus

                        // Update status ticket
                        await ControllerBus.updateStatuTicket(ticket_number, "Registered");
                        // End update status ticket

                        // update status active pic
                         await ControllerBus.updateStatusPic(ticket_number, count_member);
              
                        console.log('Bus updated successfully:', updatedData);
                        result.status = true;
                        break;
                    }
                }
            }

            return result;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateStatuTicket(ticket_number:string, status: string){
        const update:any = await RepositoryRegistration.findByRegistrationNumber(ticket_number);
        update.status = status;
        update.save();
    }

    static async checkAvailabliltyBus(id:number){
        const countJumlahMemberSaatIni:any = await RepositoryBusMember.findByBusId(id);
        const checkMuatanBusSaatIni:any = await RepositoryBus.findById(id)

        if(countJumlahMemberSaatIni.length > checkMuatanBusSaatIni.muatan){
            checkMuatanBusSaatIni.status = "Unavailable"
            checkMuatanBusSaatIni.save();
        } 
    }

    static async checkSisaMuatan(id:number){
        const countJumlahMemberSaatIni:any = await RepositoryBusMember.findByBusId(id);
        const checkMuatanBusSaatIni:any = await RepositoryBus.findById(id)
        const sisaMuatan = checkMuatanBusSaatIni.muatan - countJumlahMemberSaatIni.length
        checkMuatanBusSaatIni.sisa_muatan = sisaMuatan
        checkMuatanBusSaatIni.save();
    }
    static async update(req:Request, res:Response) {
        try {
            const id:number = parseInt(req.params.id);
            const post = req.body;
            const data = await RepositoryBus.update(id, post);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }
    static async delete(req:Request, res:Response) {
        try {
            const data = await RepositoryBus.delete(req, res);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    }

}