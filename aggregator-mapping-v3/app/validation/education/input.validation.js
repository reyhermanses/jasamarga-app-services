const {
  body
} = require("express-validator");
const repository = require("../../repositories/education.repository");
const instansiRepository = require("../../repositories/master/masterInstansiPendidikan.repository");
const fakultasRepository = require("../../repositories/master/MasterFakultasPendidikan.repository");
const gelarRepository = require("../../repositories/master/MasterGelarPendidikan.repository");
const employeeRepository = require("../../repositories/employee.repository")

exports.validate = (method) => {
  switch (method) {
    case "create":
      return [
        // employee_id
        body("employee_id").custom(async (value, {
          req
        }) => {
          if (!value) {
            return Promise.reject("employee_id wajib diisi");
          }
          const dataEmployee = await employeeRepository.acquireById(value);
          if (!dataEmployee) {
            return Promise.reject("employee_id tidak ditemukan");
          }
        }),
        // ref_jenjang_pendidikan_id
        body("ref_jenjang_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("ref_jenjang_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            let dataPendidikan = await repository.acquireByJenjangPendidikanId(
              value
            );
            if (!dataPendidikan) {
              return Promise.reject(
                "ref_jenjang_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // ref_jurusan_pendidikan_id
        body("ref_jurusan_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("ref_jurusan_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            let dataJurusan = await repository.acquireByJurusanPendidikanId(
              value
            );
            if (!dataJurusan) {
              return Promise.reject(
                "ref_jurusan_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // instansi_pendidikan_id
        body("instansi_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("instansi_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataInstansi = await instansiRepository.acquireById(value);
            if (!dataInstansi) {
              return Promise.reject(
                "instansi_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // fakultas_pendidikan_id
        body("fakultas_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("fakultas_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataInstansi = await fakultasRepository.acquireById(value);
            if (!dataInstansi) {
              return Promise.reject(
                "fakultas_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // gelar_pendidikan_id
        body("gelar_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("gelar_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataInstansi = await gelarRepository.acquireById(value);
            if (!dataInstansi) {
              return Promise.reject("gelar_pendidikan_id tidak ditemukan");
            }
          }),

        // name
        body("name")
          .not()
          .isEmpty()
          .withMessage("name wajib diisi")
          .bail()
          .isLength({
            min: 2,
            max: 100
          })
          .withMessage("name minimal 2 karakter dan maksimal 100 karakter"),

        // address
        body("address")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 100
          })
          .withMessage("address minimal 2 karakter dan maksimal 100 karakter"),

        // country_id
        body("country_id")
          .not()
          .isEmpty()
          .withMessage("country_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("country_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            let dataCountry = await repository.acquireByCountryId(value);
            if (!dataCountry) {
              return Promise.reject("country_id tidak ditemukan");
            }
          }),
        // start_date
        body("start_date")
          .not()
          .isEmpty()
          .withMessage("start_date wajib diisi")
          .bail()
          .isDate()
          .withMessage("start_date harus bertipe tanggal"),

        // graduate_date
        body("graduate_date")
          .not()
          .isEmpty()
          .withMessage("graduate_date wajib diisi")
          .bail()
          .isDate()
          .withMessage("graduate_date harus bertipe tanggal")
          .bail()
          .custom(async (value, { req }) => {
            if (req.body.start_date) {
              if (new Date(value) <= new Date(req.body.start_date)) {
                return Promise.reject("graduate_date harus lebih besar dari start_date");
              }
            }
          }),

        // title
        body("title")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 20
          })
          .withMessage("title minimal 2 karakter dan maksimal 20 karakter"),

        // no_ijazah
        body("no_ijazah")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 100
          })
          .withMessage("no_ijazah minimal 2 karakter dan maksimal 100 karakter"),

        // tanggal_ijazah
        body("tanggal_ijazah")
          .optional({
            nullable: true
          })
          .isDate()
          .withMessage("tanggal_ijazah harus bertipe tanggal"),

        // final_score
        body("final_score")
          .optional({
            nullable: true
          })
          .notEmpty() // Make sure the value is not empty
          .isString() // Ensure the value is a string
          .matches(/^\d+(?:[.]\d+)$/g) // Validate the format
          .withMessage('Final score harus bertipe a numerikal dengan koma'),

        // education_degree
        body("education_degree")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 10
          })
          .withMessage("education_degree minimal 2 karakter dan maksimal 10 karakter"),

        // changedate
        body("changedate")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 10
          })
          .withMessage("changedate minimal 2 karakter dan maksimal 10 karakter"),
      ];
    case "update":
      return [
        // employee_id
        body("employee_id")
          .custom(async (value, {
            req
          }) => {
            if (!value) {
              return Promise.reject("employee_id wajib diisi");
            }
            const dataEmployee = await repository.acquireByEmployeeId(value);
            if (!dataEmployee) {
              return Promise.reject("employee_id tidak ditemukan");
            }
          })
          .optional({
            nullable: true
          }),

        // ref_jenjang_pendidikan_id
        body("ref_jenjang_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("ref_jenjang_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            let dataPendidikan = await repository.acquireByJenjangPendidikanId(
              value
            );
            if (!dataPendidikan) {
              return Promise.reject(
                "ref_jenjang_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // ref_jurusan_pendidikan_id
        body("ref_jurusan_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("ref_jurusan_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            let dataJurusan = await repository.acquireByJurusanPendidikanId(
              value
            );
            if (!dataJurusan) {
              return Promise.reject(
                "ref_jurusan_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // instansi_pendidikan_id
        body("instansi_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("instansi_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataInstansi = await instansiRepository.acquireById(value);
            if (!dataInstansi) {
              return Promise.reject(
                "instansi_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // fakultas_pendidikan_id
        body("fakultas_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("fakultas_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataInstansi = await fakultasRepository.acquireById(value);
            if (!dataInstansi) {
              return Promise.reject(
                "fakultas_pendidikan_id tidak ditemukan"
              );
            }
          }),

        // gelar_pendidikan_id
        body("gelar_pendidikan_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("gelar_pendidikan_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataInstansi = await gelarRepository.acquireById(value);
            if (!dataInstansi) {
              return Promise.reject("gelar_pendidikan_id tidak ditemukan");
            }
          }),

        // name
        body("name")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 100
          })
          .withMessage("name minimal 2 karakter dan maksimal 100 karakter"),

        // address
        body("address")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 100
          })
          .withMessage("address minimal 2 karakter dan maksimal 100 karakter"),

        // country_id
        body("country_id")
          .optional({
            nullable: true
          })
          .isInt()
          .withMessage("country_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            let dataCountry = await repository.acquireByCountryId(value);
            if (!dataCountry) {
              return Promise.reject("country_id tidak ditemukan");
            }
          }),

        // start_date
        body("start_date")
          .optional({
            nullable: true
          })
          .isDate()
          .withMessage("start_date harus bertipe tanggal"),

        // graduate_date
        body("graduate_date")
          .optional({
            nullable: true
          })
          .isDate()
          .withMessage("graduate_date harus bertipe tanggal"),

        // title
        body("title")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 20
          })
          .withMessage("title minimal 2 karakter dan maksimal 20 karakter"),

        // no_ijazah
        body("no_ijazah")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 100
          })
          .withMessage("no_ijazah minimal 2 karakter dan maksimal 100 karakter"),

        // tanggal_ijazah
        body("tanggal_ijazah")
          .optional({
            nullable: true
          })
          .isDate()
          .withMessage("tanggal_ijazah harus bertipe tanggal"),

        // final_score
        body("final_score")
          .optional({
            nullable: true
          })
          .notEmpty() // Make sure the value is not empty
          .isString() // Ensure the value is a string
          .matches(/^\d+(?:[.]\d+)$/g) // Validate the format
          .withMessage('Final score harus bertipe a numerical value with a decimal point or comma.'),

        // education_degree
        body("education_degree")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 10
          })
          .withMessage("education_degree minimal 2 karakter dan maksimal 10 karakter"),

        // changedate
        body("changedate")
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 10
          })
          .withMessage("changedate minimal 2 karakter dan maksimal 10 karakter"),
      ];

    default:
      break;
  }
};