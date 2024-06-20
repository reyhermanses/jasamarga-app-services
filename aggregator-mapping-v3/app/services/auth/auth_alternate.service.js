const repository = require('../../repositories/auth/auth.repository')
const employeeRepository = require('../../repositories/employee.repository')
const fileRepository = require("../../repositories/file.repository");
const loginLogRepository = require("../../repositories/login_log.repository")

const ldap = require("ldapjs");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const loginData = async (requester, { username, password }) => {
  const checkData = await repository.acquireByUsername(username);

  if (!checkData) {
    const error = new Error('False Username or Password');
    error.statusCode = 401;
    throw error;
  }

  if (!checkData.employee.employee_status) {
    const error = new Error('User is Inactive');
    error.statusCode = 401;
    throw error;
  }

  if (checkData.is_ldap) {
    const result = await checkLDAP(username, password)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      })

    console.log(result)

    if (!result.status) {
      if (
        (password != process.env.DEFAULT_PASSWORD) ||
        (password == process.env.DEFAULT_PASSWORD && !checkData.default_password)
      ) {
        const error = new Error('False Username or Password');
        error.statusCode = 401;
        throw error;
      }
    } else {
      throw new Error("Ldap Timeout")
    }

  } else {
    const isSync =
      bcrypt.compareSync(password, checkData.password) ||
      password == process.env.DEFAULT_PASSWORD;

    if (
      !isSync ||
      (password == process.env.DEFAULT_PASSWORD && !checkData.default_password)
    ) {
      const error = new Error('False Username or Password');
      error.statusCode = 401;
      throw error;
    }
  }

  const dataEmployee = await employeeRepository.acquireByIdLogin(checkData.employee_id)
  const result = await getDataLogin(requester, checkData, dataEmployee)

  return result
}

const getDataLogin = async (requester, dataAuth, dataEmployee) => {
  const dataFile = await fileRepository.acquireProfilePicture(dataAuth.employee_id)
  const jti = (Math.random() + 1).toString(36).substring(7);

  const token = jwt.sign(
    {
      id: dataEmployee.id,
      position: dataEmployee.position,
      profile_id: dataEmployee.profile ? dataEmployee.profile.id : null,
      kd_comp_penugasan: dataEmployee.company_penugasan ? dataEmployee.company_penugasan.kd_comp : null,
      v_username: dataAuth.username,
      nama: dataEmployee.name,
      photo: dataFile
        ? `${process.env.HOST}/api/v1/file?filename=${dataFile.url}`
        : null,
      role: null,
      access: true,
      role: "user",
      jti: jti,
      sub: "10.1.12.242",
      multi_role: [],
      role: null,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  )

  const refreshToken = jwt.sign(
    {
      id: dataEmployee.id,
      position: dataEmployee.position,
      profile_id: dataEmployee.profile ? dataEmployee.profile.id : null,
      kd_comp_penugasan: dataEmployee.company_penugasan ? dataEmployee.company_penugasan.kd_comp : null,
      v_username: dataAuth.username,
      nama: dataEmployee.name,
      photo: dataFile
        ? `${process.env.HOST}/api/v1/file?filename=${dataFile.url}`
        : null,
      role: null,
      access: true,
      role: "user",
      jti: jti,
      sub: "10.1.12.242",
      multi_role: [],
      role: null,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  )

  const dataUpdate = {
    last_login: moment().format(),
    login_by: requester,
    token: token,
    updated_by: requester,
  };

  await repository.modernize(dataAuth.id, dataUpdate);

  await loginLogRepository.generate({
    employee_id: dataEmployee.id,
    username: dataAuth.username,
    login_time: moment().format(),
    login_by: requester,
    created_by: requester
  })

  return {
    shortTermJWT: token,
    RefreshTokenJWT: refreshToken
  }
}

const checkLDAP = async (username, password) => {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: "ldap://WDC-02.jasamarga.co.id"
      // url: "ldap://poc-adc-aws.jasamarga.co.id",
      // url: "ldap://168.68.21.26:50000",
    });

    client.bind(`jasamarga\\${username}`, password, (err) => {
      if (err) {
        return reject(false);
      } else {
        return resolve(true);
      }
    })

    client.on("error", (err) => {
      console.log(err)
    });
  })
}

const refreshTokenData = async ({ refreshToken }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error('Invalid Token, Mau Tipu2 ya');
        error.statusCode = 403;
        reject(error)
      }

      delete decoded['sub']
      delete decoded['iat']
      delete decoded['exp']
      // Generate a new access token
      const accessToken = jwt.sign(decoded, process.env.TOKEN_SECRET, { expiresIn: '2d' });

      // Send the new access token as a response
      resolve(accessToken)
    });
  })

}

module.exports = {
  loginData,
  refreshTokenData
}