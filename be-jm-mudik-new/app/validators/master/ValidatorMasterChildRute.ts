import { RequestHandler } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { ControllerMasterWilayah } from "../../controller/master/ControllerMasterWilayah";
import { ControllerMasterChildRute } from "../../controller/master/ControllerMasterChildRute";

export class ValidatorMasterChildRute {
  static rules: ValidationChain[] = [
    body("rute_id")
      .notEmpty()
      .withMessage("Kota tujuan akhir harus di isi"),
    body("kecamatan_id")
    .notEmpty()
    .withMessage("Kota tujuan harus di isi")
    .custom(async (value, {req}) => {
        const checkKecamatan = await ControllerMasterWilayah.getKecamatanById(value)

        if(!checkKecamatan){
          return Promise.reject(
            'Kota tujuan tidak ditemukan'
          );
        }

        const data = {
          rute_id: req.body.rute_id,
          kecamatan_id : req.body.kecamatan_id
        }

        const checkJalurKabupaten:any = await ControllerMasterChildRute.getJalurKecamatan(data);

        if(checkJalurKabupaten){
          return Promise.reject(
            `Jalur dan Kota tujuan sudah terdaftar`
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