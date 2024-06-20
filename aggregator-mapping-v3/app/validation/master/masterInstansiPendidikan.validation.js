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
