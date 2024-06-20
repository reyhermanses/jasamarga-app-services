const moment = require("moment");

const employee = require("../repositories/employee.repository");
const company = require("../repositories/master/masterCompany.repository");
const employeeGroup = require("../repositories/master/masterEmployeeGroup.repository");
const employeePosition = require("../repositories/employeePosition.repository");
const masterPosition = require("../repositories/master/masterPosition.repository");
const employeeProfile = require("../repositories/profile.repository");
const masterReligion = require("../repositories/master/masterReligion.repository");
const repositoryprovinsi = require("../repositories/master/masterProvince.repository");
const repositorycity = require("../repositories/master/masterCity.repository");
const repositorykecamatan = require("../repositories/master/masterKecamatan.repository");
const repositorykelurahan = require("../repositories/master/masterKelurahan.repository");

const validationNumber = async (p) => {
  if (typeof p === "number") return true;
  return false;
};

const validationString = async (p) => {
  if (typeof p === "string") return true;
  return false;
};

const validationUndefined = async (p) => {
  if (typeof p === undefined) return true;
  return false;
};

const validationDate = async (p) => {
  if (moment(p, "YYYY-MM-DD", true).isValid()) return true;
  return false;
};

const validationLengthDigit = async (p, length) => {
  let str = String(p);
  if (str.length === length) return true;
  return false;
};

const validationFloating = async (p) => {
  const regex = /^[+-]?\d+(\.\d+)?$/;
  if (regex.test(p)) return true;
  else return false;
};

const validationEmail = async (p) => {
  const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  if (regex.test(p)) return true;
  else return false;
};

const validation4rearDigits = async (p) => {
  let valid = String(p).substring(String(p).length - 4);
  if (valid === "0000") return true;
  return false;
};

const validation3rearDigits = async (p) => {
  let valid = String(p).substring(String(p).length - 3);
  if (valid === "0000") return true;
  return false;
};

const mappingNumberValidation = async (data) => {
  let collection = {};
  if (!(await validationNumber(data.value))) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus berupa angka`,
    };
  }
  return collection;
};

const mappingDigitOnly = async (data) => {
  let regexNumber = /[0-9]+/;
  let collection = {};
  if (!regexNumber.test(data.value)) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus berupa angka`,
    };
  }
  return collection;
};

const mappingLengthDigitValidation = async (data) => {
  let collection = {};
  if (!(await validationLengthDigit(data.value, data.isLength))) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus ${data.isLength} digit`,
    };
  }
  return collection;
};

const mapping4rearDigitsValidation = async (data) => {
  let collection = {};
  if (await validation4rearDigits(data.value)) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `4 angka terakhir ${data.name} tidak boleh 0000 `,
    };
  }
  return collection;
};

const mappingEmailValidation = async (data) => {
  let collection = {};
  if (!(await validationEmail(data.value))) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus berupa email`,
    };
  }
  return collection;
};

const mappingStringValidation = async (data) => {
  let collection = {};
  if (!(await validationString(data.value))) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus berupa string`,
    };
  }
  return collection;
};

const mappingBoolValidation = async (data) => {
  let collection = {};
  if (!(await validBool(data.value))) {
    collection = {
      name: data.name,
      value: (await validUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus boolean`,
    };
  }
  return collection;
};

const mappingUndefinedValidation = async (data) => {
  let collection = {};
  if (await validationUndefined(data.value)) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus terisi`,
    };
  }
  return collection;
};

const mappingDateValidation = async (data) => {
  let collection = {};
  if (!(await validationDate(data.value))) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} harus berupa tanggal`,
    };
  }
  return collection;
};

const checkExistingKtp = async (data) => {
  let collection = {};
  const response = await employeeProfile.acquireByNationalIdentifier(
    data.value
  );
  if (response) {
    collection = {
      name: data.name,
      value: (await validationUndefined(data.value)) ? "" : data.value,
      tipedata: typeof data.value,
      status: false,
      keterangan: `${data.name} sudah terdaftar`,
    };
  }
  return collection;
};

const mappingMasterRelasiValidation = async (data, name) => {
  let collection = {};
  switch (name) {
    case "company":
      const comp = await company.acquireById(data.value);
      if (!comp) {
        collection = {
          name: data.name,
          value: (await validationUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master company`,
        };
      }
      break;
    case "empGroupID":
      const empGroup = await employeeGroup.acquireById(data.value);
      if (!empGroup) {
        collection = {
          name: data.name,
          value: (await validationUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master employee group`,
        };
      }
      break;
    case "empPos":
      const masterPos = await employeePosition.acquireById(data.value);
      if (masterPos) {
        collection = {
          name: data.name,
          value: (await validationUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} sudah terdaftar`,
        };
      }
      break;
    // employeeProfile
    case "ktpExist":
      const ktpExist = await employeeProfile.acquireByIDandKTP(data.value);
      if (ktpExist) {
        collection = {
          name: data.name,
          value: (await validationUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} sudah terdaftar di Employee Profile`,
        };
      }
      break;
    case "religionNotExist":
      const religionNotExist = await masterReligion.acquireById(data.value);
      if (!religionNotExist) {
        collection = {
          name: data.name,
          value: (await validationUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} belum terdaftar di Master Religion`,
        };
      }
      break;
    case "empProfileExist":
      const empProfileExist = await employeeProfile.acquireByIdMassUpload(
        data.value
      );
      if (empProfileExist) {
        collection = {
          name: data.name,
          value: (await validationUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} sudah terdaftar di Employee Profile`,
        };
      }
      break;
    case "empProfileNotExist":
      const empProfileNotExist = await employeeProfile.acquireByIdMassUpload(
        data.value
      );
      if (!empProfileNotExist) {
        collection = {
          name: data.name,
          value: (await validationUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} belum terdaftar di Empoyee Profile`,
        };
      }
      break;
  }
  return collection;
};

const mappingExistingMasterRelasiValidation = async (data, name) => {};

const getAgama = async (data) => {
  const religion = await masterReligion.acquireById(data.value);
  return religion;
};

const validationJabatanIDEqualKdCompID = async (dataJab, dataComp) => {
  let collection = [];
  const masterPos = await masterPosition.acquireById(dataJab.value);
  if (masterPos) {
    if (masterPos.company_id !== dataComp.value) {
      collection = {
        name: dataJab.name,
        value: (await validationUndefined(dataJab.value)) ? "" : dataJab.value,
        tipedata: typeof dataJab.value,
        status: false,
        keterangan: `${dataJab.name} tidak terdaftar di ${dataComp.name}`,
      };
    }
  }
  return collection;
};

const checkIfJabatanIdExist = async (dataJab) => {
  let collection = [];
  const masterPos = await masterPosition.acquireById(dataJab.value);
  if (!masterPos) {
    collection = {
      name: dataJab.name,
      value: dataJab.value,
      tipedata: typeof dataJab.value,
      status: false,
      keterangan: `${dataJab.name} ${dataJab.value} tidak terdaftar di master position`,
    };
  }
  return collection;
};

const validationExistingJabatan = async (dataJab, dataComp) => {
  let collection = [];
  const empPos = await employeePosition.acquireByPositionId(dataJab.value);
  if (!empPos) {
    collection = {
      name: dataJab.name,
      value: (await validationUndefined(dataJab.value)) ? "" : dataJab.value,
      tipedata: typeof dataJab.value,
      status: false,
      keterangan: `Jabatan ${dataJab.value} tidak terdaftar`,
    };
  }
  return collection;
};

const validationNppJabatanIDExist = async (dataNpp, dataJab) => {
  let collection = [];
  const response = await employeePosition.acquiredByNppAndPositionId(
    dataNpp.value,
    dataJab.value
  );
  if (response) {
    collection = {
      name: dataJab.name,
      value: (await validationUndefined(dataJab.value)) ? "" : dataJab.value,
      tipedata: typeof dataJab.value,
      status: false,
      keterangan: `${dataNpp.name} dan ${dataJab.name} sudah terdaftar`,
    };
  }
  return collection;
};

const validationNppJabatanIDNotExist = async (dataNpp, dataJab) => {
  let collection = [];
  const response = await employeePosition.acquiredByNppAndPositionId(
    dataNpp.value,
    dataJab.value
  );
  if (!response) {
    collection = {
      name: `${dataNpp.name} dan ${dataJab.name}`,
      value: `${dataNpp.value} dan ${dataJab.value}`,
      status: false,
      keterangan: `${dataNpp.name} dan ${dataJab.name} belum terdaftar`,
    };
  }
  return collection;
};

const validationNppKdCompExist = async (dataNpp, dataKdComp) => {
  let collection = [];
  const response = await employee.acquireDataByNppKDComp2(
    dataNpp.value,
    dataKdComp.value
  );
  if (response) {
    collection = {
      name: `${dataNpp.name}`,
      value: (await validationUndefined(dataNpp.value))
        ? ""
        : `${dataNpp.value}`,
      tipedata: typeof dataNpp.value,
      status: false,
      keterangan: `${dataNpp.name} dan ${dataKdComp.name} sudah terdaftar`,
    };
  }
  return collection;
};

const validationNppKdCompNotExist = async (dataNpp, dataKdComp) => {
  let collection = [];
  const response = await employee.acquireDataByNppKDComp2(
    dataNpp.value,
    dataKdComp.value
  );

  if (!response) {
    collection = {
      name: `${dataNpp.name} ${dataKdComp.name}`,
      value: `${dataNpp.value} ${dataKdComp.value}`,
      status: false,
      keterangan: `${dataNpp.name} dan ${dataKdComp.name} belum terdaftar`,
    };
  }
  return collection;
};

const convertUndifinedToString = async (p) => {
  if (await validationUndefined(p)) return "";
  return p;
};

const validationRequired = async (p) => {
  if (p === "") return true;
  return false;
};

const checkedRequiredUndefinedString = async (data) => {
  let collection = {};
  if (data.value === "undefined") {
    collection = {
      name: data.name,
      value: data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} tidak boleh kosong`,
    };
  }
  return collection;
};

const mappingValidationRequired = async (data) => {
  let collection = {};
  if (data.value === "") {
    collection = {
      name: data.name,
      value: data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} tidak boleh kosong`,
    };
  }
  return collection;
};

const mappingValidationRequiredUndifined = async (data) => {
  let collection = {};
  if (data.value === undefined) {
    collection = {
      name: data.name,
      value: data.value,
      tipeData: typeof data.value,
      status: false,
      keterangan: `${data.name} tidak boleh kosong`,
    };
  }
  return collection;
};

const mappingValidationAlamat = async (data, mode) => {
  let collection = {};
  switch (mode) {
    case "checkProvinsiKtpExisting":
      const checkifexistprovinsi = await repositoryprovinsi.acquireById(
        data.value
      );
      if (!checkifexistprovinsi) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
    case "checkCityKtpExist":
      const checkifexistcity = await repositorycity.acquireById(data.value);
      if (!checkifexistcity) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
    case "checkKecamatanKtpExist":
      const checkifexistkecamatan = await repositorykecamatan.acquireById(
        data.value
      );
      if (!checkifexistkecamatan) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
    case "checkKelurahanKtpExist":
      const checkifexistkelurahan = await repositorykelurahan.acquireById(
        data.value
      );
      if (!checkifexistkelurahan) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
    case "checkPronvisiDomExist":
      const checkifexistprovinsi2 = await repositoryprovinsi.acquireById(
        data.value
      );
      if (!checkifexistprovinsi2) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
    case "checkCityDomExist":
      const checkifexistcity2 = await repositorycity.acquireById(data.value);
      if (!checkifexistcity2) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
    case "checkKecamatanDomExist":
      const checkifexistkecamatan2 = await repositorykecamatan.acquireById(
        data.value
      );
      if (!checkifexistkecamatan2) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
    case "checkKelurahanDomExist":
      const checkifexistkelurahan2 = await repositorykelurahan.acquireById(
        data.value
      );
      if (!checkifexistkelurahan2) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak terdaftar`,
        };
      }
      break;
  }
  return collection;
};

const mappingRelateWilayah = async (data, data2, mode) => {
  let collection = {};
  switch (mode) {
    case "checkIfCityExistInProvince":
      const checkIfCityExistInProvince =
        await repositorycity.acquiredByIDandProvinceID(data.value, data2.value);
      if (!checkIfCityExistInProvince) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} ${data.value} tidak terdaftar di ${data2.name} ${data2.value}`,
        };
      }
      break;
    case "checkIfKecamatanExistInCity":
      const checkIfKecamatanExistInCity =
        await repositorykecamatan.acquiredByIDandCityID(
          data.value,
          data2.value
        );
      if (!checkIfKecamatanExistInCity) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} ${data.value} tidak terdaftar di ${data2.name} ${data2.value}`,
        };
      }
      break;
    case "checkIfKelurahanExistInKecamatan":
      const checkIfKelurahanExistInKecamatan =
        await repositorykelurahan.acquiredByIDandKecamatanID(
          data.value,
          data2.value
        );
      if (!checkIfKelurahanExistInKecamatan) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} ${data.value} tidak terdaftar di ${data2.name} ${data2.value}`,
        };
      }
      break;
    case "checkIfCityExistInProvince2":
      const checkIfCityExistInProvince2 =
        await repositorycity.acquiredByIDandProvinceID(data.value, data2.value);
      if (!checkIfCityExistInProvince2) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} ${data.value} tidak terdaftar di ${data2.name} ${data2.value}`,
        };
      }
      break;
    case "checkIfKecamatanExistInCity2":
      const checkIfKecamatanExistInCity2 =
        await repositorykecamatan.acquiredByIDandCityID(
          data.value,
          data2.value
        );
      if (!checkIfKecamatanExistInCity2) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} ${data.value} tidak terdaftar di ${data2.name} ${data2.value}`,
        };
      }
      break;
    case "checkIfKelurahanExistInKecamatan2":
      const checkIfKelurahanExistInKecamatan2 =
        await repositorykelurahan.acquiredByIDandKecamatanID(
          data.value,
          data2.value
        );
      if (!checkIfKelurahanExistInKecamatan2) {
        collection = {
          name: data.name,
          value: data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} ${data.value} tidak terdaftar di ${data2.name} ${data2.value}`,
        };
      }
      break;
  }
  return collection;
};

const isMarried = async (empId) => {
  const emp_profile = await employeeProfile.acquireOneByEmployeeId(empId);
  return emp_profile;
};

const getEmployeeByNppKdComp = async (npp, kdCompId) => {
  const emp_repo = await employee.acquireByNPPAndKdCompId(npp, kdCompId);
  return emp_repo;
};

module.exports = {
  mappingRelateWilayah,
  mappingValidationAlamat,
  validationNppKdCompExist,
  validationNppKdCompNotExist,
  convertUndifinedToString,
  validationRequired,
  validationNumber,
  validationString,
  validationUndefined,
  validationDate,
  validationLengthDigit,
  validationFloating,
  validationEmail,
  validationJabatanIDEqualKdCompID,
  validationNppJabatanIDExist,
  validationNppJabatanIDNotExist,
  mappingNumberValidation,
  mappingStringValidation,
  mappingBoolValidation,
  mappingMasterRelasiValidation,
  mappingUndefinedValidation,
  mappingDateValidation,
  mappingExistingMasterRelasiValidation,
  mappingEmailValidation,
  validation4rearDigits,
  mapping4rearDigitsValidation,
  mappingLengthDigitValidation,
  mappingValidationRequired,
  checkExistingKtp,
  validationExistingJabatan,
  validation3rearDigits,
  checkedRequiredUndefinedString,
  getAgama,
  mappingValidationRequiredUndifined,
  getEmployeeByNppKdComp,
  isMarried,
  mappingDigitOnly,
  checkIfJabatanIdExist,
};
