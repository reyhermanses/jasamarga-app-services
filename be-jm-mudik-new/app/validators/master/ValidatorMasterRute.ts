import { RequestHandler } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { RepositoryRute } from "../../repositories/RepositoryRute";
import { ControllerAggregator } from "../../controller/ControllerAggregator";
import { ControllerMasterWilayah } from "../../controller/master/ControllerMasterWilayah";
import { ControllerMasterRute } from "../../controller/master/ControllerMasterRute";

export class ValidatorMasterRute {
  static rules: ValidationChain[] = [
    body("route")
      .notEmpty()
      .withMessage("Jalur is required"),
    body("kabupaten_id")
    .notEmpty()
    .withMessage("Kabupaten is required")
    .custom(async (value, {req}) => {
        const checkKabupaten = await ControllerMasterWilayah.getKabupatenById(value)

        if(!checkKabupaten){
          return Promise.reject(
            'Kabupaten/Kota tidak ditemukan'
          );
        }

        const data = {
          kabupaten_id : req.body.kabupaten_id,
          jalur: req.body.route
        }

        const checkJalurKabupaten:any = await ControllerMasterRute.getJalurKabupaten(data);

        if(checkJalurKabupaten){
          return Promise.reject(
            `Jalur dan kabupaten/kota sudah ada`
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