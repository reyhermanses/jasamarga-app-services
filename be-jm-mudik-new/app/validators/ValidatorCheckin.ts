import { RequestHandler } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";

export class ValidatorCheckin {
  static rules: ValidationChain[] = [
    body("ticket_number")
      .notEmpty()
      .withMessage("Nomor Tiket tidak boleh kosong")
      .custom(async (value) => {
        const checkregistration:any = await RepositoryRegistration.findByRegistrationNumber(value)

        if(!checkregistration){
            return Promise.reject(
             'Nomor Tiket tidak terdaftar'
            );
        }

        if(checkregistration.status === "Registration"){
            return Promise.reject(
              'Nomor Tiket masi dalam proses registrasi '
            );
        }

        if(checkregistration.status === "Checkin"){
            return Promise.reject(
              'Nomor Tiket sudah checkin'
            );
        }
      }),
  ];

  static rulesCancel: ValidationChain[] = [
    body("ticket_number")
      .notEmpty()
      .withMessage("Nomor Tiket tidak boleh kosong")
      .custom(async (value) => {
        const checkregistration:any = await RepositoryRegistration.findByRegistrationNumber(value)

        if(!checkregistration){
            return Promise.reject(
             'Nomor Tiket tidak terdaftar'
            );
        }

        if(checkregistration.status === "Cancel"){
            return Promise.reject(
              'Tidak bisa diproses, nomor tiket sudah batal!'
            );
        }
      }),
  ];

  // Cast validators array to RequestHandler type
  static validateProcess: RequestHandler = (req, res, next) => {
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

  static validateCancel: RequestHandler = (req, res, next) => {
    // Run the validation chain on the request
    Promise.all(this.rulesCancel.map((validator) => validator.run(req))).then(() => {
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