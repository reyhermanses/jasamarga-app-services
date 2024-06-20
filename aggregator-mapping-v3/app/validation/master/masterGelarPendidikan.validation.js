const { body } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "create":
      return [
        // name
        body("name")
          .not()
          .isEmpty()
          .withMessage("name wajib diisi")
          .bail()
          .isLength({ min: 3, max: 100 })
          .withMessage("name minimal 3 karakter dan maksimal 100 karakter"),

        // gelar
        body("gelar")
          .not()
          .isEmpty()
          .withMessage("gelar wajib diisi")
          .bail()
          .isLength({ min: 3, max: 100 })
          .withMessage("gelar minimal 3 karakter dan maksimal 100 karakter"),

        // type
        body('type')
          .not()
          .isEmpty()
          .withMessage("type wajib diisi")
          .bail()
          .isIn(['Strata 1', 'Strata 2', 'Strata 3'])
          .withMessage('type harus bertipe enum of Strata 1, Strata 2 and Strata 3'),

        // position
        body('position')
          .not()
          .isEmpty()
          .withMessage("position wajib diisi")
          .bail()
          .isIn(['front', 'end'])
          .withMessage('position harus bertipe enum of end and front'),

        // active
        body("active")
          .not()
          .isEmpty()
          .withMessage("active wajib diisi")
          .bail()
          .isBoolean()
          .withMessage("active harus bertipe boolean"),
      ];
    case "update":
      return [
        // name
        body("name")
          .optional({ nullable: true })
          .isLength({ min: 3, max: 100 })
          .withMessage("name minimal 3 karakter dan maksimal 100 karakter"),

        // gelar
        body("gelar")
          .optional({ nullable: true })
          .isLength({ min: 3, max: 100 })
          .withMessage("gelar minimal 3 karakter dan maksimal 100 karakter"),

        // type
        body('type')
          .optional({ nullable: true })
          .isIn(['Strata 1', 'Strata 2', 'Strata 3'])
          .withMessage('type harus bertipe enum of Strata 1, Strata 2 and Strata 3'),

        // position
        body('position')
          .optional({ nullable: true })
          .isIn(['front', 'end'])
          .withMessage('position harus bertipe enum of front and end'),

        // active
        body("active")
          .optional({ nullable: true })
          .isBoolean()
          .withMessage("active harus bertipe boolean"),
      ];

    default:
      break;
  }
};
