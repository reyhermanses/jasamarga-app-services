import { RequestHandler } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";

export class ValidatorBus {
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

        if(checkregistration.status === "Registered"){
            return Promise.reject(
              'Nomor Tiket sudah terpakai'
            );
        }
      }),
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