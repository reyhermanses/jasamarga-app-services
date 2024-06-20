import { RequestHandler } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { ControllerMasterWilayah } from "../controller/master/ControllerMasterWilayah";
import { ControllerMasterChildRute } from "../controller/master/ControllerMasterChildRute";
import { RepositoryPic } from "../repositories/RepositoryPic";

export class ValidatorPic {
  static rules: ValidationChain[] = [
    body("company_name")
      .notEmpty()
      .withMessage("Company Name harus di isi")
      .custom(async (value) => {
        const checkCompanyName = await RepositoryPic.findByCompanyName(value)
        if(checkCompanyName){
            return Promise.reject(
              'Company Name sudah terdaftar'
            );
        }
      }),
    // body("unit_kerja_name")
    // .notEmpty()
    // .withMessage("Nama Unit harus di isi")
    // .custom(async (value, {req}) => {
    //     const checkUnitName = await RepositoryPic.findByUnitName(value)
    //     if(checkUnitName){
    //       return Promise.reject(
    //         'Nama unti sudah terdaftar'
    //       );
    //     }
    // }),
    body("muatan")
    .notEmpty()
    .withMessage("Quota harus di isi"),
    body("priority")
    .notEmpty()
    .withMessage("Level prioritas harus di tentukan")
    .custom(async (value, {req}) => {
        const checkUnitName = await RepositoryPic.findByPriority(value)
        if(checkUnitName){
          return Promise.reject(
            'Level prioritas sudah terdaftar'
          );
        }
    })
    // Add more validators...
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