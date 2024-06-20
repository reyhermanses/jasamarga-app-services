const { body } = require('express-validator')

exports.validate = () => {
  return [
    // username
    body('username').not().isEmpty().withMessage('username wajib diisi'),

    // password
    body('password').not().isEmpty().withMessage('password wajib diisi'),
  ]
}