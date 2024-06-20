const { body, param } = require('express-validator')
const repository = require('../../repositories/historyJabatan.repository')

exports.validate = (method) => {
  switch (method) {
    case 'update':
      return [
        param('id').isInt().withMessage('id parameter harus bertipe integer.').bail().
          custom(async (value) => {
            const dataHisJab = await repository.acquireById(value);

            if (!dataHisJab) {
              return Promise.reject(
                'history jabatan tidak ditemukan'
              )
            }
          })
      ]
  }
}