// const { body } = require("express-validator");
const { body, validationResult } = require("express-validator");
const repositoryEmployee = require("../../repositories/employee.repository");
const repository = require("../../repositories/family.repository");

exports.validate = (method) => {
  switch (method) {
    case "create":
      return [
        // employee_id
        body("employee_id").custom(async (value, { req }) => {
          if (!value) {
            return Promise.reject("employee_id wajib diisi");
          }
          const dataEmployee = await repositoryEmployee.acquireById(value);
          if (!dataEmployee) {
            return Promise.reject("employee_id tidak ditemukan");
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
            max: 50,
          })
          .withMessage("name minimal 2 karakter dan maksimal 50 karakter")
          .bail().
          matches(/^[a-zA-Z\s]+$/).withMessage('Name Hanya boleh mengandung Alphabet')
          .bail().
          customSanitizer(value => value.toUpperCase()),

        // place_of_birth
        body("place_of_birth")
          .notEmpty()
          .withMessage("place_of_birth wajib diisi.")
          .isString()
          .withMessage("place_of_birth harus bertipe string.")
          .matches(/^[A-Za-z\s]+$/, "i")
          .withMessage(
            "place_of_birth hanya boleh mengandung alphabetic karakter"
          ),

        // date_of_birth
        body("date_of_birth")
          .not()
          .isEmpty()
          .withMessage("date_of_birth wajib diisi")
          .bail()
          .isDate()
          .withMessage("date_of_birth harus bertipe tanggal"),

        // religion_id
        body("religion_id")
          .not()
          .isEmpty()
          .withMessage("religion_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("religion_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataReligion = await repository.acquireByReligionId(value);
            if (!dataReligion) {
              return Promise.reject("religion_id tidak ditemukan");
            }
          }),

        // gender
        body("gender")
          .not()
          .isEmpty()
          .withMessage("gender wajib diisi")
          .bail()
          .isIn(["Laki-Laki", "Perempuan"])
          .withMessage("gender Hanya Boleh Laki-Laki dan Perempuan"),

        // blood_type
        body("blood_type")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 1,
            max: 10,
          })
          .withMessage("blood_type minimal 1 karakter dan maksimal 10 karakter"),

        // job
        body("job")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 2,
            max: 50,
          })
          .withMessage("job minimal 2 karakter dan maksimal 50 karakter"),

        // national_identifier
        body("national_identifier")
          .not()
          .isEmpty()
          .withMessage("national_identifier wajib diisi")
          .bail()
          .isLength({ min: 16, max: 16 })
          .withMessage("national_identifier harus 16 karakter panjangnya")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical karakter
          .withMessage(
            "national_identifier harus bertipe string numerical karakter."
          )
          .custom(async (value) => {
            const lastFourkarakter = value.slice(-4);
            const isUsedNatId = await repository.acquireByNationalIdentiifier(value)

            if (lastFourkarakter === "0000") {
              return Promise.reject(
                "national_identifier tidak valid dengan 0000 diakhir"
              );
            }

            if (isUsedNatId) {
              return Promise.reject(
                "national_identifier sudah pernah dipakai"
              );
            }
          }),

        // paspor_no
        body("paspor_no")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 2,
            max: 50,
          })
          .withMessage("paspor_no minimal 2 karakter dan maksimal 50 karakter"),

        // place_of_death
        body("place_of_death")
          .optional() // Make the field optional for updates
          .isString()
          .matches(/^[A-Za-z\s]+$/, "i")
          .withMessage(
            "Place of Death hanya boleh mengandung alphabetic karakter."
          ),

        // date_of_death
        body("date_of_death")
          .optional({
            nullable: true,
          })
          .isDate()
          .withMessage("date_of_death harus bertipe tanggal"),

        // start_date
        body("start_date")
          .optional({
            nullable: true,
          })
          .isDate()
          .withMessage("start_date harus bertipe tanggal"),

        // end_date
        body("end_date")
          .optional({
            nullable: true,
          })
          .isDate()
          .withMessage("end_date harus bertipe tanggal"),

        // active
        body("active")
          .optional({
            nullable: true,
          })
          .isBoolean()
          .withMessage("active harus boolean"),

        // change_date
        body("change_date")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 2,
            max: 10,
          })
          .withMessage("change_date minimal 2 karakter dan maksimal 10 karakter"),

        // family_status_id
        body("family_status_id")
          .not()
          .isEmpty()
          .withMessage("family_status_id wajib diisi")
          .bail()
          .isInt()
          .withMessage("family_status_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataStatusKeluarga =
              await repository.acquireByMasterStatusKeluargaId(value);
            if (!dataStatusKeluarga) {
              return Promise.reject("family_status_id tidak ditemukan");
            }
          }),

        // object_id
        // body("object_id")
        //   .not()
        //   .isEmpty()
        //   .withMessage("object_id wajib diisi")
        //   .bail()
        //   .isInt()
        //   .withMessage("object_id harus type of Integer"),
      ];
    case "update":
      return [
        // employee_id
        body("employee_id")
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject("employee_id wajib diisi");
            }
            const dataEmployee = await repositoryEmployee.acquireById(value);
            if (!dataEmployee) {
              return Promise.reject("employee_id tidak ditemukan");
            }
          })
          .optional({
            nullable: true,
          }),

        // name
        body("name")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 2,
            max: 50,
          })
          .withMessage("name minimal 2 karakter dan maksimal 50 karakter")
          .bail().
          matches(/^[a-zA-Z\s]+$/).withMessage('Name Hanya boleh mengandung Alphabet')
          .bail().
          customSanitizer(value => value.toUpperCase()),

        body("place_of_birth")
          .optional() // Make the field optional for updates
          .isString()
          .matches(/^[A-Za-z\s]+$/, "i")
          .withMessage(
            "Place of birth hanya boleh mengandung alphabetic karakter."
          ),

        // date_of_birth
        body("date_of_birth")
          .optional({
            nullable: true,
          })
          .isDate()
          .withMessage("date_of_birth harus bertipe tanggal"),

        // religion_id
        body("religion_id")
          .optional({
            nullable: true,
          })
          .isInt()
          .withMessage("religion_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataReligion = await repository.acquireByReligionId(value);
            if (!dataReligion) {
              return Promise.reject("religion_id tidak ditemukan");
            }
          }),

        // gender
        body("gender")
          .optional({
            nullable: true,
          })
          .isIn(["Laki-Laki", "Perempuan"])
          .withMessage("gender hanya boleh Laki-Laki dan Perempuan"),

        // blood_type
        body("blood_type")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 1,
            max: 10,
          })
          .withMessage("blood_type minimal 1 karakter dan maksimal 10 karakter"),

        // job
        body("job")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 2,
            max: 50,
          })
          .withMessage("job minimal 2 karakter dan maksimal 50 karakter"),

        // national_identifier
        body("national_identifier")
          .optional({ nullable: true })
          .bail()
          .isLength({ min: 16, max: 16 })
          .withMessage("national_identifier harus 16 karakter panjangnya")
          .bail()
          .isString()
          .matches(/^[0-9]+$/, "i") // Regular expression to match only numerical karakter
          .withMessage(
            "national_identifier harus bertipe string of numerical karakter."
          )
          .custom(async (value) => {
            const lastFourkarakter = value.slice(-4);
            const isUsedNatId = await repository.acquireByNationalIdentiifier(value)

            if (lastFourkarakter === "0000") {
              return Promise.reject(
                "national_identifier tidak valid dengan 0000 diakhir"
              );
            }

            if (isUsedNatId) {
              return Promise.reject(
                "national_identifier sudah pernah dipakai"
              );
            }
          }),

        // paspor_no
        body("paspor_no")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 2,
            max: 50,
          })
          .withMessage("paspor_no minimal 2 karakter dan maksimal 50 karakter"),

        // place_of_death
        body("place_of_death")
          .optional() // Make the field optional for updates
          .isString()
          .matches(/^[A-Za-z\s]+$/, "i")
          .withMessage(
            "Place of Death hanya boleh mengandung alphabetic karakter."
          ),

        // date_of_death
        body("date_of_death")
          .optional({
            nullable: true,
          })
          .isDate()
          .withMessage("date_of_death harus bertipe tanggal"),

        // start_date
        body("start_date")
          .optional({
            nullable: true,
          })
          .isDate()
          .withMessage("start_date harus bertipe tanggal"),

        // end_date
        body("end_date")
          .optional({
            nullable: true,
          })
          .isDate()
          .withMessage("end_date harus bertipe tanggal"),

        // active
        body("active")
          .optional({
            nullable: true,
          })
          .isBoolean()
          .withMessage("active harus boolean"),

        // change_date
        body("change_date")
          .optional({
            nullable: true,
          })
          .isLength({
            min: 2,
            max: 10,
          })
          .withMessage("change_date minimal 2 karakter dan maksimal 10 karakter"),

        // family_status_id
        body("family_status_id")
          .optional({
            nullable: true,
          })
          .isInt()
          .withMessage("family_status_id harus bertipe integer")
          .bail()
          .custom(async (value) => {
            const dataStatusKeluarga =
              await repository.acquireByMasterStatusKeluargaId(value);
            if (!dataStatusKeluarga) {
              return Promise.reject("family_status_id tidak ditemukan");
            }
          }),

        // object_id
        // body('object_id').optional({
        //   nullable: true
        // })
        //   .isInt().withMessage('object_id harus type of Integer'),
      ];

    default:
      break;
  }
};
