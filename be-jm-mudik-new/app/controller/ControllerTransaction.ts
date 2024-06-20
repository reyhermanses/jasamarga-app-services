import { NextFunction, Request, Response } from "express";
import { RepositoryPic } from "../repositories/RepositoryPic";
import { buildApiResponse } from "../utils/Response";
import Sequelize from "../config/Sequelize";
import { ControllerRegistration } from "./ControllerRegistration";
import { ControllerRegistrationMember } from "./ControllerRegistrationMember";
import { ControllerBus } from "./ControllerBus";
import { RepositoryRegistrationMember } from "../repositories/RepositoryRegistrationMember";

export class ControllerTransaction {
  static async index(req: Request, res: Response) {
    try {
      const data = await RepositoryPic.findAll(req, res);

      res.json(buildApiResponse(true, 200, data));
    } catch (error) {
      console.log(error);
    }
  }
  static async create(req: Request, res: Response) {
    try {
      const data = await RepositoryPic.create(req, res);
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async update(req: Request, res: Response) {
    try {
      const data = await RepositoryPic.update(req, res);
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async updateActive(id: number) {
    try {
      const postData = {
        active: false,
      };
      const data = await RepositoryPic.updateActive(id, postData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(req: Request, res: Response) {
    // const t = new sequelize.Transaction();
    try {
      const data = await RepositoryPic.delete(req, res);
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async insert_collection(req: Request, res: Response) {
    const trx = await Sequelize.transaction();
    try {
      const postData: any = req.body.data;

      const postRegistration = {
        pic_id: postData.dataTiket.pic_id,
        master_rute_id: postData.dataTiket.master_rute_id,
        master_child_rute_id: postData.dataTiket.master_child_rute_id,
        master_tanggal_mudik_id: postData.dataTiket.master_tanggal_mudik_id,
        registration_number: postData.dataTiket.registration_number,
        registration_place: postData.dataTiket.registration_place,
      };

      const dataRegistration: any =
        await ControllerRegistration.create_collection(postRegistration, trx);

      if (!dataRegistration) {
        throw new Error("Registrasi tidak bisa dibuat");
      }

      const postMemberParent = {
        registration_id: dataRegistration.dataValues.id,
        // parent_id: 22,
        nama_lengkap: postData.dataParentKeluarga.namaLengkap,
        gender: postData.dataParentKeluarga.jk,
        // tanggal_lahir: postDataParentKeluarga.tanggalLahir,
        no_ktp: postData.dataParentKeluarga.no_ktp,
        alamat: postData.dataParentKeluarga.alamat,
        no_hp: postData.dataParentKeluarga.no_hp,
      };

      const dataMemberParent: any =
        await ControllerRegistrationMember.create_collection(
          postMemberParent,
          trx
        );

      if (!dataMemberParent) {
        throw new Error("Registrasi penumpang utama gagal");
      }

      if (postData.dataKeluarga.length > 0) {
        const dataKeluarga = postData.dataKeluarga;
        for (const e of dataKeluarga) {
          const postDataKeluarga = {
            registration_id: dataRegistration.dataValues.id,
            parent_id: dataMemberParent.dataValues.id,
            nama_lengkap: e.namaLengkap,
            gender: e.jk,
            no_ktp: e.no_ktp,
            alamat: e.alamat,
            no_hp: e.no_hp,
          };
          await ControllerRegistrationMember.create_collection(
            postDataKeluarga,
            trx
          );
        }
      }

      const dataBus = ControllerBus.create_collection(
        postData.dataTiket.registration_number
      );

      if (!dataBus) {
        throw new Error("Pendataan penumpang di bus gagal");
      }

      await trx.commit();
      return res.status(201).json(`Registrasi berhasil dibuat`);
    } catch (error: any) {
      console.log(error);
      await trx.rollback();
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  static async insert_collection_passanger(
    dataKeluarga: any,
    dataRegistration: any,
    dataMemberParent: any,
    trx: any
  ) {
    dataKeluarga.map(async (e: any) => {
      const postDataKeluarga = {
        registration_id: dataRegistration.dataValues.id,
        parent_id: dataMemberParent.dataValues.id,
        nama_lengkap: e.namaLengkap,
        gender: e.jk,
        // tanggal_lahir: postDataParentKeluarga.tanggalLahir,
        no_ktp: e.no_ktp,
        alamat: e.alamat,
        no_hp: e.no_hp,
      };
      // console.log(e)
      ControllerRegistrationMember.create_collection(postDataKeluarga, trx);
    });
  }
}
