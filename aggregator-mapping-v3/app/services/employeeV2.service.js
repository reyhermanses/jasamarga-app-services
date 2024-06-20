const repository = require("../repositories/employeeV2.repository");
const {
  acquireCount,
  acquireById: acquireDepartement,
} = require("../repositories/organizationHierarchy.repository");
const Redis = require("../../config/redis");

require("dotenv").config();
const moment = require("moment");

const getAllTinyData = async (query) => {
  delete query.type;

  if (query.cluster && query.cluster_kode) {
    const error = new Error("filter is invalid");
    error.statusCode = 422;
    throw error;
  }

  const keys = Object.keys(query);
  const checkKeys = keys.filter((obj) => {
    return (
      obj !== "npp" &&
      obj !== "kd_comp" &&
      obj !== "nama" &&
      obj !== "unit_kerja_id" &&
      obj !== "unit_kerja" &&
      obj !== "direktorat_id" &&
      obj !== "direktorat" &&
      obj !== "departemen_id" &&
      obj !== "cluster" &&
      obj !== "grade" &&
      obj !== "cluster_kode" &&
      obj !== "employee_group"
    );
  });

  if (checkKeys.length > 0) {
    const error = new Error("filter is invalid");
    error.statusCode = 422;
    throw error;
  }

  const { reply } = await Redis.get("employee-alternate:tiny");
  if (Object.keys(query).length === 0) {
    if (reply) {
      return JSON.parse(reply);
    } else {
      const data = JSON.parse(
        JSON.stringify(await repository.acquireAllTinyData(query))
      );
      Redis.set("employee-alternate:tiny", JSON.stringify(data));
      return data;
    }
  } else {
    const data = JSON.parse(
      JSON.stringify(await repository.acquireAllTinyData(query))
    );
    return data;
  }
};

const getAllData = async (query) => {
  try {
    if (Object.keys(query).length === 0) {
      // const { reply } = await Redis.get("employee-alternate");

      // if (reply) {
      //   console.log(reply)
      //   return JSON.parse(reply);
      // } else {
      let data = JSON.parse(
        JSON.stringify(await repository.acquireAllData(query))
      );
      data = data.map((item) => {
        // Filter the data with main_position: true
        const mainPositionData = item.position.filter(
          (item) => item.main_position === true
        );

        // Randomly select one item if there are multiple
        let selectedData;
        if (mainPositionData.length > 1) {
          const randomIndex = Math.floor(
            Math.random() * mainPositionData.length
          );
          selectedData = mainPositionData[randomIndex];
        } else if (mainPositionData.length === 1) {
          selectedData = mainPositionData[0];
        } else {
          selectedData = null; // No data with main_position: true
        }

        return {
          ...item,
          ...selectedData,
        };
      });
      const newData = mappingData(data);
      // Redis.set("employee-alternate", JSON.stringify(newData));
      return newData;
      // }
    } else {
      const keys = Object.keys(query);

      if (query.cluster && query.cluster_kode) {
        const error = new Error("filter is invalid");
        error.statusCode = 422;
        throw error;
      }

      const checkKeys = keys.filter((obj) => {
        return (
          obj !== "npp" &&
          obj !== "kd_comp" &&
          obj !== "position_id" &&
          obj !== "kd_comp_asal" &&
          obj !== "nama" &&
          obj !== "unit_kerja_id" &&
          obj !== "unit_kerja" &&
          obj !== "direktorat_id" &&
          obj !== "direktorat" &&
          obj !== "departemen_id" &&
          obj !== "seksi_id" &&
          obj !== "cluster" &&
          obj !== "grade" &&
          obj !== "cluster_kode" &&
          obj !== "employee_group" &&
          obj !== "employee_status" &&
          obj !== "company_id"
        );
      });

      if (checkKeys.length > 0) {
        const error = new Error("filter is invalid");
        error.statusCode = 422;
        throw error;
      }

      let data = JSON.parse(
        JSON.stringify(await repository.acquireAllData(query))
      );

      data = await Promise.all(data.map(async (item) => {
        if (item.position.length === 0) {
          const historyJabatan = await repository.acquireInactiveNPP(item.id)
          item.position = [
            historyJabatan ? historyJabatan : {}
          ]
        }

        const mainPositionData = item.position.filter(
          (item) => item.main_position === true
        );

        let selectedData;
        if (mainPositionData.length > 1) {
          const randomIndex = Math.floor(Math.random() * mainPositionData.length);
          selectedData = mainPositionData[randomIndex];
        } else if (mainPositionData.length === 1) {
          selectedData = mainPositionData[0];
        } else {
          selectedData = null;
        }

        return {
          ...item,
          ...selectedData,
        };
      }));
      const newData = mappingData(data);
      return newData;
    }
  } catch (error) {
    console.log(error)
  }

};

const getCountData = async (query) => {
  let datas = await acquireCount(query);
  if (query.department_id) {
    const departmentData = await acquireDepartement(query.department_id);

    if (!departmentData) {
      return [];
    }

    const count = await repository.acquireByDepartement(query.department_id);

    datas = datas.filter((obj) => {
      return obj.unit_kerja_id == departmentData.parent_id;
    });

    datas = datas.map((obj) => {
      obj.departemen_id = departmentData ? departmentData.id : null;
      obj.departemen_name = departmentData ? departmentData.name : null;
      obj.total = count ? count.count_employee : 0;
      return obj;
    });
  }
  return datas;
};

const getBawahanData = async (query) => {
  const keys = Object.keys(query);

  const checkKeys = keys.filter((obj) => {
    return obj !== "NPP" && obj !== "CompanyCode" && obj !== "PositionID";
  });

  if (Object.keys(query).length < 3 || checkKeys.length > 0) {
    const error = new Error("filter is invalid");
    error.statusCode = 422;
    throw error;
  } else {
    const getEmployee = JSON.parse(
      JSON.stringify(
        await repository.acquireByIdentity(
          query.NPP,
          query.CompanyCode,
          query.PositionID
        )
      )
    );
    console.log(getEmployee);
    if (!getEmployee) {
      const error = new Error("Data not Found");
      error.statusCode = 404;
      throw error;
    }

    const getBawahan = JSON.parse(
      JSON.stringify(await repository.acquireByAtasanId(getEmployee.id))
    );

    const result = {
      id: getEmployee.id,
      person_name: getEmployee.person_name,
      employee_number: getEmployee.employee_number,
      position_id: getEmployee.position_id,
      position_name: getEmployee.position_name,
      unit_kerja_id: getEmployee.unit_kerja_id,
      unit_kerja_name: getEmployee.unit_kerja_name,
      unit_kerja_type_org: getEmployee.position_detail.type_organization,
      organization_id: getEmployee.org_id,
      organization_name: getEmployee.position_detail.organization_name,
      total_bawahan: getBawahan.length,
      bawahan: getBawahan,
    };
    return result;
  }
};

const getAtasanData = async (query) => {
  const keys = Object.keys(query);

  const checkKeys = keys.filter((obj) => {
    return obj !== "NPP" && obj !== "CompanyCode" && obj !== "PositionID";
  });

  if (Object.keys(query).length < 3 || checkKeys.length > 0) {
    const error = new Error("filter is invalid");
    error.statusCode = 422;
    throw error;
  } else {
    const getEmployee = JSON.parse(
      JSON.stringify(
        await repository.acquireByIdentity(
          query.NPP,
          query.CompanyCode,
          query.PositionID
        )
      )
    );
    if (
      !getEmployee ||
      (getEmployee.atasan_ap_id == null && getEmployee.atasan_id == null)
    ) {
      const error = new Error("Data not Found");
      error.statusCode = 404;
      throw error;
    }

    let getAtasan;
    if (getEmployee.is_pusat == true) {
      getAtasan = await repository.acquireDataAtasan(
        getEmployee.atasan_id,
        getEmployee.atasan_position_id
      );
    } else {
      if (getEmployee.atasan_id != null) {
        getAtasan = await repository.acquireDataAtasan(
          getEmployee.atasan_id,
          getEmployee.atasan_position_id
        );
      } else {
        getAtasan = await repository.acquireDataAtasan(
          getEmployee.atasan_ap_id,
          getEmployee.atasan_ap_position_id
        );
      }
    }

    if (getAtasan) {
      getEmployee.employee_number_atasan = getAtasan.npp;
      getEmployee.nama_atasan = getAtasan.dataValues.person_name;
      getEmployee.atasan_company = getAtasan.position_detail.company_position;
      getEmployee.atasan_kd_grade =
        getAtasan.dataValues.employee_position_kd_grade;
      getEmployee.atasan_position_id = getAtasan.dataValues.position_id;
      getEmployee.atasan_position_name = getAtasan.dataValues.position_name;
      getEmployee.atasan_grade = getAtasan.dataValues.employee_position_grade;
      getEmployee.atasan_job = getAtasan.position_detail.job_position;
      getEmployee.atasan_unit = getAtasan.position_detail.unit_position;
    }

    if (getEmployee.position_detail != null) {
      getEmployee.employee_position_company =
        getEmployee.position_detail.company_position;
      getEmployee.position_name = getEmployee.position_detail.name;
      getEmployee.employee_position_job =
        getEmployee.position_detail.job_position;

      delete getEmployee.position_detail;
    }

    return getEmployee;
  }
};

const calculateAge = (dateOfBirth) => {
  const birthDate = moment(dateOfBirth);
  const currentDate = moment();

  const age = currentDate.diff(birthDate, 'years');

  // Adjust age if birthday has not occurred yet in the current year
  if (moment(currentDate).isBefore(moment(birthDate).add(age, 'years'))) {
    return age - 1;
  }
  return age;
};

const mappingData = (data) => {
  data.map(async (obj) => {
    if (obj.gender == true) {
      obj.gender = "Laki-Laki";
    } else if (obj.gender == false) {
      obj.gender = "Perempuan";
    } else {
      obj.gender = null;
    }

    if (obj.url_image) {
      obj.url_image = `${process.env.HOST}/api/v1/file?filename=${obj.url_image}`;
    } else {
      obj.url_image = null;
    }
    obj.personal_data = obj.profile;
    if (obj.personal_data) {
      obj.personal_data.religion = obj.personal_data.profile_religion
        ? obj.personal_data.profile_religion.religion
        : null;

      let age = null;

      if (obj.personal_data.date_of_birth) {
        age = await calculateAge(obj.personal_data.date_of_birth);
        // moment().year() -
        // parseInt(obj.personal_data.date_of_birth.substring(0, 4));
      }

      obj.age = age;
      obj.address = {
        address_ktp: obj.personal_data.address_ktp,
        cityid_ktp: obj.personal_data.cityid_ktp,
        city_ktp: obj.personal_data.city_ktp
          ? obj.personal_data.city_ktp.description
          : null,
        provinceid_ktp: obj.personal_data.provinceid_ktp,
        province_ktp: obj.personal_data.province_ktp
          ? obj.personal_data.province_ktp.description
          : null,
        address_domicile: obj.personal_data.address_domicile,
        cityid_domicile: obj.personal_data.cityid_domicile,
        city_domicile: obj.personal_data.city_domicile
          ? obj.personal_data.city_domicile.description
          : null,
        provinceid_domicile: obj.personal_data.provinceid_domicile,
        province_domicile: obj.personal_data.province_domicile
          ? obj.personal_data.province_domicile.description
          : null,
        rt: obj.personal_data.rt ?? null,
        rw: obj.personal_data.rw ?? null,
        rt_domicile: obj.personal_data.rt_domicile ?? null,
        rw_domicile: obj.personal_data.rw_domicile ?? null,
        domicile_kecamatan: obj.personal_data.domicile_kecamatan_name ?? null,
        domicile_kelurahan: obj.personal_data.domicile_kelurahan_name ?? null,
        ktp_kecamatan: obj.personal_data.ktp_kecamatan_name ?? null,
        ktp_kelurahan: obj.personal_data.ktp_kelurahan_name ?? null,
      };
      obj.bpjs = {
        bpjs_kes_no: obj.personal_data.bpjs_kes_no,
        bpjs_ket_no: obj.personal_data.bpjs_ket_no,
      };
      delete obj.personal_data.bpjs_kes_no;
      delete obj.personal_data.bpjs_ket_no;
      delete obj.personal_data.profile_religion;
      delete obj.personal_data.city_ktp;
      delete obj.personal_data.city_domicile;
      delete obj.personal_data.province_ktp;
      delete obj.personal_data.domicile_kecamatan_name;
      delete obj.personal_data.domicile_kelurahan_name;
      delete obj.personal_data.ktp_kecamatan_name;
      delete obj.personal_data.ktp_kelurahan_name;
      delete obj.personal_data.rt;
      delete obj.personal_data.rw;
      delete obj.personal_data.rt_domicile;
      delete obj.personal_data.rw_domicile;
    }
    delete obj.profile;
  });
  return data;
};

const getByIDData = async (id) => {
  let data = await repository.acquireEmployeeByID(id);
  if (!data) {
    const error = new Error("Data Not Found");
    error.statusCode = 404;
    throw error;
  }

  if (!data.employee_status) {
    const inActivePosition = await repository.acquireInactiveNPP(id);
    data.npp = inActivePosition.npp;
    data.employee_subgroup = inActivePosition.kelompok_jabatan;
    data.kelompok_jabatan = inActivePosition.kelompok_jabatan;
    data.employee_group = inActivePosition.employee_group;
  } else {
    const mainPosition = await repository.acquireMainPosition(id);
    data = mainPosition;
  }

  return data;
};

module.exports = {
  getAllData,
  getAtasanData,
  getBawahanData,
  getAllTinyData,
  getCountData,
  getByIDData,
  calculateAge
};
