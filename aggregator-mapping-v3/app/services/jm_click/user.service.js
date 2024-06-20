const repository = require('../../repositories/jm_click/user.repository')
const empRepository = require('../../repositories/employee.repository')
const userAuthRepository = require('../../repositories/auth/auth.repository')

const moment = require('moment')
const bcrypt = require('bcrypt')

async function getAllData() {
  return await repository.acquireAllData()
}

async function syncData() {
  console.log('MASHOOK')
  const dataUser = await repository.acquireAllData()
  matchingData(dataUser)
  return dataUser
}

async function matchingData(dataUser) {
  console.log("Syncing JM-AUTH Asynchronously - ", moment().format('YYYY-MM-DD HH:mm:ss'))
  for (let i = 0; i < dataUser.length; i++) {
    const dataEmp = await empRepository.acquireAllData({}, { npp: dataUser[i].NPP, kd_comp: dataUser[i].KD_COMP }, 'tiny')
    if (dataEmp.length > 0) {
      const dataAuth = {
        employee_id: dataEmp[0].id,
        username: dataUser[i].V_USERNAME,
        password: bcrypt.hashSync(dataUser[i].C_PASSWORD, 12),
        is_ldap: false,
        is_mobile: dataUser[i].IS_MOBILE == 1 ? true : false,
        token: dataUser[i].V_TOKEN,
        token_firebase: dataUser[i].TOKEN_FIREBASE,
        last_login: dataUser[i].D_LAST_LOGIN,
      }
      // console.log(dataAuth)
      await userAuthRepository.upsert(dataAuth)
    }
    console.log(`${i}/${dataUser.length}`)
  }
  console.log('Done Syncing JM-AUTH Asynchronously', moment().format('YYYY-MM-DD HH:mm:ss'))
}

module.exports = {
  getAllData,
  syncData
}

