import { RequestHandler } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { ControllerMasterWilayah } from "../controller/master/ControllerMasterWilayah";
import { ControllerMasterChildRute } from "../controller/master/ControllerMasterChildRute";
import { RepositoryPic } from "../repositories/RepositoryPic";
import { RepositoryRegistration } from "../repositories/RepositoryRegistration";
import { RepositoryRegistrationMember } from "../repositories/RepositoryRegistrationMember";

export class ValidatorRegistrationMember {
  static rules: ValidationChain[] = [
    body("registration_id")
      .notEmpty()
      .withMessage("Nomor registrasi tidak boleh kosong")
      .custom(async (value) => {
        const checkregistration = await RepositoryRegistration.findById(value)
        if(!checkregistration){
            return Promise.reject(
              'Nomor registrasi belum terdaftar'
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