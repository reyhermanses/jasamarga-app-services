const { body } = require("express-validator");
const repository = require("../../repositories/employee.repository");
const searchCity =
  require("../../repositories/master/masterCity.repository").acquireById;
const searchProvince =
  require("../../repositories/master/masterProvince.repository").acquireById;
const searchReligion =
  require("../../repositories/master/masterReligion.repository").acquireById;

const searchEducation =
  require("../../repositories/education.repository").acquireById;

const {
  acquireByNationalIdentifier,
  acquireByNoKK,
} = require("../../repositories/profile.repository");

const {
  acquireByMaritalStatusEverMarried,
} = require("../../repositories/family.repository");

const { acquireById } = require("../../repositories/profile.repository");

const kecamatanRepository = require("../../repositories/master/masterKecamatan.repository");
const kelurahanRepository = require("../../repositories/master/masterKelurahan.repository");

exports.validate = (method) => {
  switch (method) {
    case "create":
      return [
        // employee_id
        body("employee_id").custom(async (value, { req }) => {
          if (!value) {
            return Promise.reject("employee_id wajib diisi");
          }
          const dataEmployee = await repository.acquireById(value);
          if (!dataEmployee) {
            return Promise.reject("employee_id tidak ditemukan");
          }
        }),

        // national_identifier
        body("national_identifier")
          .not()
          .isEmpty()
          .withMessage("national_identifier wajib diisi")
          .bail()
          .isLength({ min: 16, max: 16 })
          .withMessage("national_identifier harus 16 karakter penjangnya")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage(
            "national_identifier harus bertipe string yang berisi angka"
          )
          .custom(async (value) => {
            const lastFourCharacter = value.slice(-4);
            if (lastFourCharacter === "0000") {
              return Promise.reject(
                "national_identifier tidak valid dengan 0000 diakhir"
              );
            }
            const checkNationalIdentifier = await acquireByNationalIdentifier(
              value
            );
            if (checkNationalIdentifier) {
              return Promise.reject(
                `national_identifier ${value} sudah dipakai oleh ${checkNationalIdentifier.employee.name}`
              );
            }
          }),

        // place_of_birth
        body("place_of_birth")
          .not()
          .isEmpty()
          .withMessage("place_of_birth wajib diisi")
          .bail()
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "place_of_birth minimal 2 karakter dan maksimal 50 karakter"
          ),

        // date_of_birth
        body("date_of_birth")
          .not()
          .isEmpty()
          .withMessage("date_of_birth wajib diisi")
          .bail()
          .isDate()
          .withMessage("date_of_birth harus dalam format tanggal"),

        // gender
        body("gender")
          .not()
          .isEmpty()
          .withMessage("gender wajib diisi")
          .bail()
          .isBoolean()
          .withMessage("gender harus boolean"),

        // address_ktp
        body("address_ktp")
          .not()
          .isEmpty()
          .withMessage("address_ktp wajib diisi")
          .bail()
          .isLength({ min: 2, max: 100 })
          .withMessage(
            "address_ktp minimal 2 karakter dan maksimal 100 karakter"
          ),

        // address_domicile
        body("address_domicile")
          .not()
          .isEmpty()
          .withMessage("address_domicile wajib diisi")
          .bail()
          .isLength({ min: 2, max: 100 })
          .withMessage(
            "address_domicile minimal 2 karakter dan maksimal 100 karakter"
          ),

        // city_ktp_id
        body("city_ktp_id")
          .not()
          .isEmpty()
          .withMessage("city_ktp_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("city_ktp_id harus integer")
          .custom(async (value) => {
            let dataCity = await searchCity(value);
            if (!dataCity) {
              return Promise.reject("city_ktp_id tidak ditemukan");
            }
          }),

        // province_ktp_id
        body("province_ktp_id")
          .not()
          .isEmpty()
          .withMessage("province_ktp_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("province_ktp_id harus integer")
          .custom(async (value) => {
            let dataProvince = await searchProvince(value);
            if (!dataProvince) {
              return Promise.reject("province_ktp_id tidak ditemukan");
            }
          }),

        // city_domicile_id
        body("city_domicile_id")
          .not()
          .isEmpty()
          .withMessage("city_domicile_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("city_domicile_id harus integer")
          .custom(async (value) => {
            let dataCity = await searchCity(value);
            if (!dataCity) {
              return Promise.reject("city_domicile_id tidak ditemukan");
            }
          }),

        // province_domicile_id
        body("province_domicile_id")
          .not()
          .isEmpty()
          .withMessage("province_domicile_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("province_domicile_id harus integer")
          .custom(async (value) => {
            let dataProvince = await searchProvince(value);
            if (!dataProvince) {
              return Promise.reject("province_domicile_id tidak ditemukan");
            }
          }),

        // front_title_education
        body("front_title_education")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "front_title_education minimal 2 karakter dan maksimal 20 karakter"
          ),

        // end_title_education
        body("end_title_education")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "end_title_education minimal 2 karakter dan maksimal 20 karakter"
          ),

        // religion_id
        body("religion_id")
          .not()
          .isEmpty()
          .withMessage("religion_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("religion_id harus integer")
          .custom(async (value) => {
            let dataReligion = await searchReligion(value);
            if (!dataReligion) {
              return Promise.reject("religion_id tidak ditemukan");
            }
          }),

        // marital_status
        body("marital_status")
          .not()
          .isEmpty()
          .withMessage("marital_status wajib diisi")
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "marital_status minimal 2 karakter dan maksimal 20 karakter"
          ),

        // npwp
        body("npwp").not().isEmpty().withMessage("npwp wajib diisi"),

        // status_npwp
        body("status_npwp")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 10 })
          .withMessage(
            "status_npwp minimal 2 karakter dan maksimal 10 karakter"
          ),

        // blood_type
        body("blood_type")
          .optional({ nullable: true })
          .isLength({ min: 1, max: 10 })
          .withMessage(
            "blood_type minimal 1 karakter dan maksimal 10 karakter"
          ),

        // height
        body("height")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 10 })
          .withMessage("height minimal 2 karakter dan maksimal 10 karakter")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage("height harus bertipe string yang berisi angka"),

        // weight
        body("weight")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 10 })
          .withMessage("weight minimal 2 karakter dan maksimal 10 karakter")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage("weight harus bertipe string yang berisi angka"),

        // telephone_no
        body("telephone_no")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "telephone_no minimal 2 karakter dan maksimal 20 karakter"
          )
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical character
          .withMessage("telephone_no harus bertipe string yang berisi angka"),

        // bpjs_kes_no
        body("bpjs_kes_no")
          .not()
          .isEmpty()
          .withMessage("bpjs_kes_no wajib diisi"),

        // bpjs_ket_no
        body("bpjs_ket_no")
          .not()
          .isEmpty()
          .withMessage("bpjs_ket_no wajib diisi"),

        // paspor_no
        body("paspor_no")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage("paspor_no minimal 2 karakter dan maksimal 20 karakter"),

        // facebook
        body("facebook").optional({ nullable: true }).bail().trim(),

        // twitter
        body("twitter").optional({ nullable: true }).bail().trim(),

        // instagram
        body("instagram").optional({ nullable: true }).bail().trim(),

        // summary
        body("summary")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage("summary minimal 2 karakter dan maksimal 100 karakter"),

        // interest
        body("interest")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage("interest minimal 2 karakter dan maksimal 100 karakter"),

        // last_education_id
        body("last_education_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("last_education_id harus integer")
          .custom(async (value) => {
            let dataEducation = await searchEducation(value);
            if (!dataEducation) {
              return Promise.reject("last_education_id tidak ditemukan");
            }
          }),

        // email_pribadi
        body("email_pribadi")
          .not()
          .isEmpty()
          .withMessage("email_pribadi wajib diisi")
          .bail()
          .isEmail()
          .withMessage("email_pribadi harus Email yang valid"),

        // rt
        body("rt")
          .not()
          .isEmpty()
          .withMessage("rt wajib diisi")
          .bail()
          .isLength({ min: 3, max: 10 })
          .withMessage("rt minimal 3 karakter dan maksimal 10 karakter"),

        // rw
        body("rw")
          .not()
          .isEmpty()
          .withMessage("rw wajib diisi")
          .bail()
          .isLength({ min: 3, max: 10 })
          .withMessage("rw minimal 3 karakter dan maksimal 10 karakter"),

        // kd_pos
        body("kd_pos")
          .not()
          .isEmpty()
          .withMessage("kd_pos wajib diisi")
          .bail()
          .isLength({ min: 2, max: 10 })
          .withMessage("kd_pos minimal 2 karakter dan maksimal 10 karakter"),

        // rt_domicile
        body("rt_domicile")
          .not()
          .isEmpty()
          .withMessage("rt_domicile wajib diisi")
          .bail()
          .isLength({ min: 3, max: 10 })
          .withMessage(
            "rt_domicile minimal 3 karakter dan maksimal 10 karakter"
          ),

        // rw_domicile
        body("rw_domicile")
          .not()
          .isEmpty()
          .withMessage("rw_domicile wajib diisi")
          .bail()
          .isLength({ min: 3, max: 10 })
          .withMessage(
            "rw_domicile minimal 3 karakter dan maksimal 10 karakter"
          ),

        // no_dana_pension
        body("no_dana_pension")
          .optional({ nullable: true })
          .isLength({ min: 1, max: 20 })
          .withMessage(
            "no_dana_pension minimal 1 karakter dan maksimal 20 karakter"
          )
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage(
            "no_dana_pension harus bertipe string yang berisi angka"
          ),

        // kelurahan_ktp_id
        body("kelurahan_ktp_id")
          .not()
          .isEmpty()
          .withMessage("kelurahan_ktp_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("kelurahan_ktp_id harus integer")
          .custom(async (value) => {
            let dataKelurahan = await kelurahanRepository.acquireById(value);
            if (!dataKelurahan) {
              return Promise.reject("kelurahan_ktp_id tidak ditemukan");
            }
          }),

        // kelurahan_domicile_id
        body("kelurahan_domicile_id")
          .not()
          .isEmpty()
          .withMessage("kelurahan_domicile_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("kelurahan_domicile_id harus integer")
          .custom(async (value) => {
            let dataKelurahan = await kelurahanRepository.acquireById(value);
            if (!dataKelurahan) {
              return Promise.reject("kelurahan_domicile_id tidak ditemukan");
            }
          }),

        // kecamatan_ktp_id
        body("kecamatan_ktp_id")
          .not()
          .isEmpty()
          .withMessage("kecamatan_ktp_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("kecamatan_ktp_id harus integer")
          .custom(async (value) => {
            let dataKecamatan = await kecamatanRepository.acquireById(value);
            if (!dataKecamatan) {
              return Promise.reject("kecamatan_ktp_id tidak ditemukan");
            }
          }),

        // kecamatan_domicile_id
        body("kecamatan_domicile_id")
          .not()
          .isEmpty()
          .withMessage("kecamatan_domicile_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("kecamatan_domicile_id harus integer")
          .custom(async (value) => {
            let dataKecamatan = await kecamatanRepository.acquireById(value);
            if (!dataKecamatan) {
              return Promise.reject("kecamatan_domicile_id tidak ditemukan");
            }
          }),

        // no_kk
        body("no_kk")
          .optional({ nullable: true })
          .bail()
          .isLength({ min: 16, max: 16 })
          .withMessage("no_kk harus 16 karakter penjangnya")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage("no_kk harus bertipe string yang berisi angka")
          .bail()
          .custom(async (value) => {
            const lastFourkarakteracters = value.slice(-4);
            if (lastFourkarakteracters === "0000") {
              return Promise.reject("no kk tidak valid dengan 0000 diakhir");
            }
          }),

        // kd_pos_domicile
        body("kd_pos_domicile")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage(
            "kd_pos_domicile minimal 2 karakter dan maksimal 100 karakter"
          ),
      ];
    case "update":
      return [
        // employee_id
        body("employee_id")
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject("employee_id wajib diisi");
            }
            const dataEmployee = await repository.acquireById(value);
            if (!dataEmployee) {
              return Promise.reject("employee_id tidak ditemukan");
            }
          })
          .optional({ nullable: true }),

        // national_identifier
        body("national_identifier")
          .optional({ nullable: true })
          .bail()
          .isLength({ min: 16, max: 16 })
          .withMessage("national_identifier harus 16 karakter penjangnya")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage(
            "national_identifier harus bertipe string yang berisi angka"
          )
          .custom(async (value) => {
            const lastFourCharacter = value.slice(-4);
            if (lastFourCharacter === "0000") {
              return Promise.reject(
                "national_identifier tidak valid dengan 0000 diakhir"
              );
            }
            const checkNationalIdentifier = await acquireByNationalIdentifier(
              value
            );
            if (checkNationalIdentifier) {
              return Promise.reject(
                `national_identifier ${value} sudah dipakai oleh ${checkNationalIdentifier.employee.name}`
              );
            }
          }),

        // place_of_birth
        body("place_of_birth")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "place_of_birth minimal 2 karakter dan maksimal 50 karakter"
          ),

        // date_of_birth
        body("date_of_birth")
          .optional({ nullable: true })
          .isDate()
          .withMessage("date_of_birth harus dalam format tanggal"),

        // rt
        body("rt")
          .optional({ nullable: true })
          .isLength({ min: 3, max: 10 })
          .withMessage("rt minimal 3 karakter dan maksimal 10 karakter"),

        // rw
        body("rw")
          .optional({ nullable: true })
          .isLength({ min: 3, max: 10 })
          .withMessage("rw minimal 3 karakter dan maksimal 10 karakter"),

        // gender
        body("gender")
          .optional({ nullable: true })
          .isBoolean()
          .withMessage("gender harus boolean"),

        // address_ktp
        body("address_ktp")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage(
            "address_ktp minimal 2 karakter dan maksimal 100 karakter"
          ),

        // address_domicile
        body("address_domicile")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage(
            "address_domicile minimal 2 karakter dan maksimal 100 karakter"
          ),

        // city_ktp_id
        body("city_ktp_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("city_ktp_id harus integer")
          .custom(async (value) => {
            let dataCity = await searchCity(value);
            if (!dataCity) {
              return Promise.reject("city_ktp_id tidak ditemukan");
            }
          }),

        // province_ktp_id
        body("province_ktp_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("province_ktp_id harus integer")
          .custom(async (value) => {
            let dataProvince = await searchProvince(value);
            if (!dataProvince) {
              return Promise.reject("province_ktp_id tidak ditemukan");
            }
          }),

        // city_domicile_id
        body("city_domicile_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("city_domicile_id harus integer")
          .custom(async (value) => {
            let dataCity = await searchCity(value);
            if (!dataCity) {
              return Promise.reject("city_domicile_id tidak ditemukan");
            }
          }),

        // province_domicile_id
        body("province_domicile_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("province_domicile_id harus integer")
          .custom(async (value) => {
            let dataProvince = await searchProvince(value);
            if (!dataProvince) {
              return Promise.reject("province_domicile_id tidak ditemukan");
            }
          }),

        // front_title_education
        body("front_title_education")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "front_title_education minimal 2 karakter dan maksimal 20 karakter"
          ),

        // end_title_education
        body("end_title_education")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "end_title_education minimal 2 karakter dan maksimal 20 karakter"
          ),

        // religion_id
        body("religion_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("religion_id harus integer")
          .custom(async (value) => {
            let dataReligion = await searchReligion(value);
            if (!dataReligion) {
              return Promise.reject("religion_id tidak ditemukan");
            }
          }),

        // marital_status
        body("marital_status")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "marital_status minimal 2 karakter dan maksimal 20 karakter"
          )
          .bail()
          .custom(async (value, { req }) => {
            const maritalStatus = value.toLowerCase();
            const profileData = await acquireById(req.params.id);
            const everMarried = await acquireByMaritalStatusEverMarried(
              profileData.employee_id
            );

            if (maritalStatus === "lajang" && everMarried) {
              return Promise.reject(
                "data keluarga sudah ada dan tidak bisa lajang lagi"
              );
            }
          }),

        // status_npwp
        body("status_npwp")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 10 })
          .withMessage(
            "status_npwp minimal 2 karakter dan maksimal 10 karakter"
          ),

        // blood_type
        body("blood_type")
          .optional({ nullable: true })
          .isLength({ min: 1, max: 10 })
          .withMessage(
            "blood_type minimal 1 karakter dan maksimal 10 karakter"
          ),

        // height
        body("height")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 10 })
          .withMessage("height minimal 2 karakter dan maksimal 10 karakter")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage("height harus bertipe string yang berisi angka"),

        // weight
        body("weight")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 10 })
          .withMessage("weight minimal 2 karakter dan maksimal 10 karakter")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage("weight harus bertipe string yang berisi angka"),

        // telephone_no
        body("telephone_no")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage(
            "telephone_no minimal 2 karakter dan maksimal 20 karakter"
          )
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical karakteracters
          .withMessage("telephone_no harus bertipe string yang berisi angka"),

        // bpjs_kes_no
        // body("bpjs_kes_no")
        //   .optional({ nullable: true })
        //   .isLength({ min: 2, max: 20 })
        //   .withMessage("bpjs_kes_no minimal 2 karakter dan maksimal 20 karakter")
        //   .bail()
        //   .isString()
        //   .matches(/^[0-9]+$/, 'i') // Regular expression to match only numerical Character
        //   .withMessage('bpjs_kes_no harus bertipe string yang berisi angka'),

        // bpjs_ket_no
        // body("bpjs_ket_no")
        // .optional({ nullable: true })
        // .isLength({ min: 2, max: 20 })
        // .withMessage("bpjs_ket_no minimal 2 karakter dan maksimal 20 karakter")
        // .bail()
        // .isString()
        // .matches(/^[0-9]+$/, 'i') // Regular expression to match only numerical Character
        // .withMessage('bpjs_ket_no harus bertipe string yang berisi angka'),

        // paspor_no
        body("paspor_no")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 20 })
          .withMessage("paspor_no minimal 2 karakter dan maksimal 20 karakter"),

        // facebook
        body("facebook").optional({ nullable: true }).bail().trim(),

        // twitter
        body("twitter").optional({ nullable: true }).bail().trim(),

        // instagram
        body("instagram").optional({ nullable: true }).bail().trim(),

        // summary
        body("summary")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage("summary minimal 2 karakter dan maksimal 100 karakter"),

        // interest
        body("interest")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage("interest minimal 2 karakter dan maksimal 100 karakter"),

        // last_education_id
        body("last_education_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("last_education_id harus integer")
          .custom(async (value) => {
            let dataEducation = await searchEducation(value);
            if (!dataEducation) {
              return Promise.reject("last_education_id tidak ditemukan");
            }
          }),

        // kelurahan_ktp_id
        body("kelurahan_ktp_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("kelurahan_ktp_id harus integer")
          .custom(async (value) => {
            let dataKelurahan = await kelurahanRepository.acquireById(value);
            if (!dataKelurahan) {
              return Promise.reject("kelurahan_ktp_id tidak ditemukan");
            }
          }),

        // kelurahan_domicile_id
        body("kelurahan_domicile_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("kelurahan_domicile_id harus integer")
          .custom(async (value) => {
            let dataKelurahan = await kelurahanRepository.acquireById(value);
            if (!dataKelurahan) {
              return Promise.reject("kelurahan_domicile_id tidak ditemukan");
            }
          }),

        // kecamatan_ktp_id
        body("kecamatan_ktp_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("kecamatan_ktp_id harus integer")
          .custom(async (value) => {
            let dataKecamatan = await kecamatanRepository.acquireById(value);
            if (!dataKecamatan) {
              return Promise.reject("kecamatan_ktp_id tidak ditemukan");
            }
          }),

        // kecamatan_domicile_id
        body("kecamatan_domicile_id")
          .optional({ nullable: true })
          .isInt()
          .withMessage("kecamatan_domicile_id harus integer")
          .custom(async (value) => {
            let dataKecamatan = await kecamatanRepository.acquireById(value);
            if (!dataKecamatan) {
              return Promise.reject("kecamatan_domicile_id tidak ditemukan");
            }
          }),

        // email_pribadi
        body("email_pribadi")
          .optional({ nullable: true })
          .bail()
          .isEmail()
          .withMessage("email_pribadi harus Email yang valid"),

        // kd_pos
        body("kd_pos")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 10 })
          .withMessage("kd_pos minimal 2 karakter dan maksimal 10 karakter"),

        // rt_domicile
        body("rt_domicile")
          .optional({ nullable: true })
          .isLength({ min: 3, max: 10 })
          .withMessage(
            "rt_domicile minimal 3 karakter dan maksimal 10 karakter"
          ),

        // rw_domicile
        body("rw_domicile")
          .optional({ nullable: true })
          .isLength({ min: 3, max: 10 })
          .withMessage(
            "rw_domicile minimal 3 karakter dan maksimal 10 karakter"
          ),

        // no_dana_pension
        body("no_dana_pension")
          .optional({ nullable: true })
          .isLength({ min: 1, max: 20 })
          .withMessage(
            "no_dana_pension minimal 1 karakter dan maksimal 20 karakter"
          )
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage(
            "no_dana_pension harus bertipe string yang berisi angka"
          ),

        // no_kk
        body("no_kk")
          .optional({ nullable: true })
          .bail()
          .isLength({ min: 16, max: 16 })
          .withMessage("no_kk harus 16 karakter penjangnya")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical Character
          .withMessage("no_kk harus bertipe string yang berisi angka")
          .bail()
          .bail()
          .custom(async (value) => {
            const lastFourkarakteracters = value.slice(-4);
            if (lastFourkarakteracters === "0000") {
              return Promise.reject("no kk tidak valid dengan 0000 diakhir");
            }
          }),

        // kd_pos_domicile
        body("kd_pos_domicile")
          .optional({ nullable: true })
          .isLength({ min: 2, max: 100 })
          .withMessage(
            "kd_pos_domicile minimal 2 karakter dan maksimal 100 karakter"
          ),
      ];
  }
};
