import { RequestHandler } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { RepositoryPic } from "../repositories/RepositoryPic";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";
import { RepositoryMasterRute } from "../repositories/master/RepositoryMasterRute";
import { RepositoryMasterChildRute } from "../repositories/master/RepositoryMasterChildRute";
import { RepositoryMasterTanggalMudik } from "../repositories/master/RepositoryMasterTanggalMudik";

export class ValidatorRegistration {
  static rules: ValidationChain[] = [
    body("pic_id")
      .notEmpty()
      .withMessage("PIC harus di isi")
      .custom(async (value) => {
        const checkpic = await RepositoryPic.findById(value)
        if(!checkpic){
            return Promise.reject(
              'Pic tidak ditemukan'
            );
        }
      }),
      body("master_rute_id")
      .notEmpty()
      .withMessage("Rute harus di isi")
      .custom(async (value) => {
        const checkrute = await RepositoryMasterRute.findById(value)
        if(!checkrute){
            return Promise.reject(
              'Kota tujuan terakhir tidak ditemukan'
            );
        }
      }),
      body("master_child_rute_id")
      .notEmpty()
      .withMessage("Kota tujuan harus di isi")
      .custom(async (value) => {
        const checkchildrute = await RepositoryMasterChildRute.findById(value)
        if(!checkchildrute){
            return Promise.reject(
              'Kota tujuan tidak ditemukan'
            );
        }
      }),
      body("master_tanggal_mudik_id")
      .notEmpty()
      .withMessage("Tanggal harus di isi")
      .custom(async (value) => {
        const checkdate = await RepositoryMasterTanggalMudik.findById(value)
        if(!checkdate){
            return Promise.reject(
              'Tanggal keberangkatan harus di isi'
            );
        }
      }),
      body("registration_number")
      .notEmpty()
      .withMessage("Nomor registrasi harus di isi")
      .custom(async (value) => {
        const checkdate = await RepositoryRegistration.findByRegistrationNumber(value)
        if(checkdate){
            return Promise.reject(
              'Nomor Registrasi sudah terdaftar'
            );
        }
      }),
      body("registration_place")
      .notEmpty()
      .withMessage("Tempat pendaftaran harus di isi"),
  ];

  // Cast validators array to RequestHandler type
  static validate: RequestHandler = (req, res, next) => {
    // Run the validation chain on the request
    Promise.all(this.rules.map((validator) => validator.run(req))).then(() => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        next();
      } else {
        const extractedErrors: any = [];
        errors.array().map((err: any) =>
          extractedErrors.push({
            [err.path]: err.msg,
          })
        );
        return res.status(422).json({ errors: extractedErrors });
      }
    });
  };
}

// Your validators