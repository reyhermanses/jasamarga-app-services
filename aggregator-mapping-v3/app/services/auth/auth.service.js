const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const ldap = require("ldapjs");
const moment = require("moment");
const xlsx = require("xlsx");

const repository = require("../../repositories/auth/auth.repository");
const employeeRepository = require("../../repositories/employee.repository");
const fileRepository = require("../../repositories/file.repository");
const loginLogRepository = require("../../repositories/login_log.repository");

dotenv.config();

async function checkAdmin(username, password) {
  const isSync = bcrypt.compareSync(
    password,
    "$2b$12$aqWkee98aIc8SB33ave8butUQvhf5MwFpQ8uhyDu6KuU.tyBoWZSu"
  );
  const isUsernameSync = username == "admin-aggregator" ? true : false;

  if (isSync && isUsernameSync) {
    const token = jwt.sign(
      {
        username: username,
        access: true,
        role: "admin",
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    let expiresToken = "";
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        res.status(403).send(sendResponse.unauthorized("False Credential"));
      } else {
        expiresToken = decoded.exp;
      }
    });

    return {
      expires: expiresToken,
      jwt: token,
    };
  } else {
    throw new Error("False Username or Password");
  }
}

const checkNonAdminTemporary = async (req, username, password) => {
  const dataAuth = await repository.acquireByUsername(username);

  if (!dataAuth) {
    throw new Error("False Username or Password");
  }

  const { employee_status: empStatus } = await employeeRepository.acquireById(
    dataAuth.employee_id
  );

  if (!empStatus) {
    throw new Error("User is Inactive");
  }

  if (dataAuth.is_ldap) {
    const result = await checkLdap(username, password)
      .then((res) => {
        console.log(res)
        return res;
      })
      .catch((err) => {
        return err;
      });

    const errorCode = result.error?.code;

    if (errorCode !== "ETIMEDOUT") {
      if (
        (!result.status && password != process.env.DEFAULT_PASSWORD) ||
        (password == process.env.DEFAULT_PASSWORD && !dataAuth.default_password)
      ) {
        if (result.error.code === 49) {
          throw new Error("False Username or Password");
        }

        if (result.error.code === 532) {
          throw new Error("LDAP Password Expired");
        }
      }
    } else {
      throw new Error(`Ldap ETIMEDOUT`);
    }
  } else {
    const isSync =
      bcrypt.compareSync(password, dataAuth.password) ||
      password == process.env.DEFAULT_PASSWORD;
    if (
      !isSync ||
      (password == process.env.DEFAULT_PASSWORD && !dataAuth.default_password)
    ) {
      throw new Error("False Username or Password");
    }
  }

  const dataFile = await fileRepository.acquireProfilePicture(
    dataAuth.employee_id
  );

  const dataEmployee = await employeeRepository.acquireLoginDataTemporary(
    dataAuth,
    dataFile
  );

  if (!dataEmployee.employee_status) {
    throw new Error("Inactive User");
  }

  const jti = (Math.random() + 1).toString(36).substring(7);

  const token = jwt.sign(
    {
      id: dataEmployee.id,
      user: dataEmployee.username,
      profile_id: dataEmployee.employee.profile_id,
      username: dataEmployee.username,
      v_username: username,
      kd_comp: dataEmployee.kd_comp,
      kd_comp_asal: dataEmployee.kd_comp_asal,
      kd_comp_penugasan: dataEmployee.kd_comp_penugasan,
      kelompok_jabatan: dataEmployee.kelompok_jabatan,
      nama: dataEmployee.name,
      unit_kerja_id: dataEmployee.employee_position.unit_kerja_id,
      kdunit: dataEmployee.employee_position.unit_kerja_id,
      nama: dataEmployee.nm,
      unit: dataEmployee.employee_position.unit_kerja,
      userid: `${dataEmployee.username}${dataEmployee.kd_comp}`,
      position_id: dataEmployee.employee_position.position_id,
      photo: dataFile
        ? `${process.env.HOST}/api/v1/file?filename=${dataFile.url}`
        : null,
      role: "user",
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
  );

  const tokenRefresh = jwt.sign(
    {
      id: dataEmployee.id,
      user: dataEmployee.username,
      profile_id: dataEmployee.employee.profile_id,
      username: dataEmployee.username,
      v_username: username,
      kd_comp: dataEmployee.kd_comp,
      kd_comp_penugasan: dataEmployee.kd_comp_penugasan,
      kelompok_jabatan: dataEmployee.kelompok_jabatan,
      nama: dataEmployee.name,
      unit_kerja_id: dataEmployee.employee_position.unit_kerja_id,
      kdunit: dataEmployee.employee_position.unit_kerja_id,
      nama: dataEmployee.nm,
      unit: dataEmployee.employee_position.unit_kerja,
      userid: `${dataEmployee.username}${dataEmployee.kd_comp}`,
      position_id: dataEmployee.employee_position.position_id,
      photo: dataFile
        ? `${process.env.HOST}/api/v1/file?filename=${dataFile.url}`
        : null,
      role: "user",
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
  );

  let expiresToken = "";
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      res.status(403).send(sendResponse.unauthorized("False Credential"));
    } else {
      expiresToken = decoded.exp;
    }
  });
  const dataUpdate = {
    last_login: moment().format(),
    token: token,
    updated_by: "aggregator-api",
  };

  await repository.modernize(dataAuth.id, dataUpdate);

  await loginLogRepository.generate({
    employee_id: dataEmployee.id,
    username: username,
    login_time: moment().format(),
    login_by: req.api_key.name,
    created_by: req.api_key.name,
  });

  const resData = {
    ...dataEmployee,
    auth: {
      expires: expiresToken,
      jwt: token,
      refresh: tokenRefresh,
    },
  };

  return resData;
};

async function checkNonAdmin(req, username, password) {
  const dataAuth = await repository.acquireByUsername(username);

  if (!dataAuth) {
    throw new Error("False Username or Password");
  }

  const { employee_status: empStatus } = await employeeRepository.acquireById(
    dataAuth.employee_id
  );

  if (!empStatus) {
    throw new Error("User is Inactive");
  }

  if (dataAuth.is_ldap) {
    const result = await checkLdap(username, password)
      .then((res) => {
        console.log(res)
        return res;
      })
      .catch((err) => {
        return err;
      });

    const errorCode = result.error?.code;

    if (errorCode !== "ETIMEDOUT") {
      if (
        (!result.status && password != process.env.DEFAULT_PASSWORD) ||
        (password == process.env.DEFAULT_PASSWORD && !dataAuth.default_password)
      ) {
        if (result.error.code === 49) {
          throw new Error("False Username or Password");
        }

        if (result.error.code === 532) {
          throw new Error("LDAP Password Expired");
        }
      }
    } else {
      throw new Error(`Ldap ETIMEDOUT`);
    }

  } else {
    const isSync =
      bcrypt.compareSync(password, dataAuth.password) ||
      password == process.env.DEFAULT_PASSWORD;
    if (
      !isSync ||
      (password == process.env.DEFAULT_PASSWORD && !dataAuth.default_password)
    ) {
      throw new Error("False Username or Password");
    }
  }

  const dataEmployee = await employeeRepository.acquireByIdLogin(
    dataAuth.employee_id
  );

  if (!dataEmployee.employee_status) {
    throw new Error("Inactive User");
  }

  const dataFile = await fileRepository.acquireProfilePicture(
    dataAuth.employee_id
  );

  const jti = (Math.random() + 1).toString(36).substring(7);

  const token = jwt.sign(
    {
      id: dataEmployee.id,
      position: dataEmployee.position,
      profile_id: dataEmployee.profile ? dataEmployee.profile.id : null,
      kd_comp_penugasan: dataEmployee.company_penugasan
        ? dataEmployee.company_penugasan.kd_comp
        : null,
      v_username: username,
      nama: dataEmployee.name,
      photo: dataFile
        ? `${process.env.HOST}/api/v1/file?filename=${dataFile.url}`
        : null,
      role: "user",
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
  );
  let expiresToken = "";
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      res.status(403).send(sendResponse.unauthorized("False Credential"));
    } else {
      expiresToken = decoded.exp;
    }
  });
  const dataUpdate = {
    last_login: moment().format(),
    token: token,
    updated_by: "aggregator-api",
  };

  await repository.modernize(dataAuth.id, dataUpdate);

  await loginLogRepository.generate({
    employee_id: dataEmployee.id,
    username: username,
    login_time: moment().format(),
    login_by: req.api_key.name,
    created_by: req.api_key.name,
  });

  const positionData = dataEmployee.position.map((obj) => {
    return {
      username: obj.npp,
      person_number_sap: obj.npp,
      employe_position_id: obj.position_id,
      employee_number: obj.npp,
      company_id: obj.dataValues.company_id,
      position_id: obj.position_id,
      name: obj.dataValues.position_name,
      active: obj.dataValues.active,
      sk_position_no: obj.dataValues.sk_position_no,
      start_date: obj.dataValues.start_date,
      end_date: obj.dataValues.end_date,
      org_name: obj.dataValues.org_name,
      org_id_parent: obj.dataValues.org_parent_id,
      org_parent_name: obj.dataValues.org_parent_name,
      org_grand_parent: obj.dataValues.org_grand_parent,
      org_grand_parent_name: obj.dataValues.org_grand_parent_name,
      unit_kerja_id: obj.dataValues.unit_kerja_id,
      unit_kerja: obj.dataValues.unit,
      unit_kerja_type_org: obj.dataValues.type_organization,
      location_id: null,
      location_name: null,
      grade: obj.dataValues.grade,
      subgrade: "5C",
      layer: null,
      job_id: obj.dataValues.job_id,
      job_name: obj.dataValues.job_name,
      job_type: "",
      person_number_approver: obj.dataValues.penilai_npp,
      personal_area: obj.dataValues.personal_area,
      personal_sub_area: obj.dataValues.personal_sub_area,
      cluster_kode: obj.dataValues.cluster_kode,
      subcluster_code: obj.dataValues.subcluster_code,
      subcluster_name: obj.dataValues.subcluster_name,
      subcluster_fungsi: obj.dataValues.subcluster_fungsi,
      company_name: obj.dataValues.company_name,
      kd_grade: obj.dataValues.kd_grade,
      kd_unit: obj.dataValues.kdunit,
      kelompok_jabatan: obj.dataValues.kelompok_jabatan,
      fungsi_jabatan: obj.dataValues.fungsi_jabatan,
    };
  });

  const resData = {
    id: dataEmployee.id,
    v_username: username,
    role: null,
    multi_role: [],
    employee_number: null,
    latitude: null,
    longtitude: null,
    batas_checkin: null,
    batas_checkout: null,
    mulai_overtime: null,
    UNIQ_CODE: null,
    nm: dataEmployee.name,
    employee: {
      id: dataEmployee.id,
      employee_id: dataEmployee.id,
      business_area: dataEmployee.MasterBusinessArea
        ? dataEmployee.MasterBusinessArea.description
        : null,
      person_name: dataEmployee.name,
      national_identifier: dataEmployee.profile
        ? dataEmployee.profile.national_identifier
        : null,
      sex: dataEmployee.profile ? dataEmployee.profile.gender : null,
      original_date_of_hire: dataEmployee.date_of_entry,
      npwp: dataEmployee.profile ? dataEmployee.profile.npwp : null,
      status_npwp: dataEmployee.profile
        ? dataEmployee.profile.status_npwp
        : null,
      emp_status: dataEmployee.employee_status,
      url_image: dataFile
        ? `${process.env.HOST}/api/v1/file?filename=${dataFile.url}`
        : null,
      front_title_education: dataEmployee.profile
        ? dataEmployee.profile.front_title_education
        : null,
      end_title_education: dataEmployee.profile
        ? dataEmployee.profile.end_title_education
        : null,
      rangkap_jabatan: dataEmployee.is_rangkap_jabatan,
      rangkap_jabatan: false,
      sk_phk_no: null,
      sk_phk_date: null,
      phk_out_date: null,
      ket_phk: null,
      place_of_birth: dataEmployee.profile
        ? dataEmployee.profile.place_of_birth
        : null,
      company_code_asal: dataEmployee.company.kd_comp,
      kd_comp: dataEmployee.company.kd_comp,
      company_code_penugasan: dataEmployee.company_penugasan
        ? dataEmployee.company_penugasan.kd_comp
        : null,
      kd_comp_penugasan: dataEmployee.company_penugasan
        ? dataEmployee.company_penugasan.kd_comp
        : null,
      employee_group: dataEmployee.group
        ? dataEmployee.group.description
        : null,
    },
    employee_position: positionData,
    auth: {
      expires: expiresToken,
      jwt: token,
    },
  };

  return resData;
}

function checkLdap(username, password) {
  return new Promise((resolve, reject) => {
    var client = ldap.createClient({
      // url: "ldap://poc-adc-aws.jasamarga.co.id",
      // url: "ldap://168.68.21.26:50000",
      // url: "ldap://168.68.21.26:389",
      url: "ldap://WDC-02.jasamarga.co.id",
    });

    client.bind(`jasamarga\\${username}`, password, (err) => {
      if (err) {
        return reject({ status: false, error: err });
      } else {
        return resolve({ status: true, error: null });
      }
    });

    client.on("error", function () { });
  });
}

async function migrateData(path) {
  const workBook = xlsx.readFile(path);
  var sheet_name_list = workBook.SheetNames;
  let jsonData = xlsx.utils.sheet_to_json(workBook.Sheets[sheet_name_list[0]]);

  for (let i = 0; i < jsonData.length; i++) {
    const dataEmployee = await employeeRepository.acquireAllData(
      {},
      {
        npp: jsonData[i].npp,
        kd_comp: jsonData[i].kd_comp,
      },
      null
    );
    if (dataEmployee.length > 0) {
      await repository.upsert({
        username: jsonData[i].username,
        password: bcrypt.hashSync(String(jsonData[i].password), 12),
        employee_id: dataEmployee[0].id,
        npp: 210154,
        is_mobile: false,
        is_ldap: false,
      });
    }
  }

  return jsonData;
}

module.exports = {
  checkAdmin,
  checkNonAdmin,
  migrateData,
  checkNonAdminTemporary,
};
