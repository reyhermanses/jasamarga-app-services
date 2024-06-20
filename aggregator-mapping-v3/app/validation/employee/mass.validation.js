const masterCompanyRepository = require("../../repositories/master/masterCompany.repository");
const masterInstansiPendidikanRepository = require("../../repositories/master/masterInstansiPendidikan.repository");
const masterJenjangPendidikanRepository = require("../../repositories/master/masterJenjangPendidikan.repository");
const masterJurusanPendidikanRepository = require("../../repositories/master/masterJurusanPendidikan.repository");
const masterFakultasPendidikanRepository = require("../../repositories/master/MasterFakultasPendidikan.repository");
const masterGelarPendidikanRepository = require("../../repositories/master/MasterGelarPendidikan.repository");
const employeeRepository = require("../../repositories/employee.repository");
const masterStatusKeluargaRepository = require("../../repositories/master/masterStatusKeluarga.repository");
const employeeProfileRepository = require("../../repositories/profile.repository");
const employeeFamilyRepository = require("../../repositories/family.repository");
const moment = require("moment");

const validateDataPendidikan = async (obj, i) => {
  const camelCaseObject = transformKeysToCamelCase(obj);

  let returnedData = {
    number_rows: parseInt(i) + 1,
    error: [],
    ...camelCaseObject,
    sheetName: "Pendidikan Terakhir",
    status: "Success",
    employeeId: null,
  };

  let isKdComTrue = false;

  // validasi NPP
  if (!obj.NPP) {
    returnedData.error.push({
      name: "NPP",
      value: null,
      tipeData: typeof obj.NPP,
      status: false,
      keterangan: "NPP WAJIB DI ISI",
    });
  }

  // validasi KD Comp ID
  if (!obj["KD Comp ID"]) {
    returnedData.error.push({
      name: "KDCompID",
      value: null,
      tipeData: typeof obj["KD Comp ID"],
      status: false,
      keterangan: "KD COMP WAJIB DI ISI",
    });
  } else {
    if (!onlyNumerical(obj["KD Comp ID"])) {
      isKdComTrue = true;
      returnedData.error.push({
        name: "KDCompID",
        value: null,
        tipeData: typeof obj["KD Comp ID"],
        status: false,
        keterangan: "KD COMP HARUS ANGKA",
      });
    } else {
      const companyExist = await masterCompanyRepository.acquireById(
        obj["KD Comp ID"]
      );
      if (!companyExist) {
        returnedData.error.push({
          name: "KDCompID",
          value: null,
          tipeData: typeof obj["KD Comp ID"],
          status: false,
          keterangan: "KD COMP TIDAK TERDAFTAR DI MASTER",
        });
      }
    }
  }

  // validasi NPP dan KD Comp ID
  if (obj.NPP && obj["KD Comp ID"] && !isKdComTrue) {
    console.log('ceck kid comp dan npp')
    const isEmployeeExist = await employeeRepository.acquireByNppAndKdCompId2(
      String(obj.NPP),
      obj["KD Comp ID"]
    );
    console.log('end ceck kid comp dan npp')

    if (!isEmployeeExist) {
      returnedData.error.push({
        name: "NPP & KDCOMP",
        value: null,
        tipeData: typeof obj["NPP"],
        status: false,
        keterangan: `DATA KARYAWAN BELUM DI BUAT`,
      });
    } else {
      returnedData.employeeId = isEmployeeExist.id;
    }
  }

  // validasi Instansi Pendidikan ID
  if (!obj["Instansi Pendidikan ID"]) {
    returnedData.error.push({
      name: "InstansiPendidikanID",
      value: null,
      tipeData: typeof obj["Instansi Pendidikan ID"],
      status: false,
      keterangan: "INSTANSI PENDIDIKAN WAJIB DI ISI",
    });
  } else {
    if (onlyNumerical(obj["Instansi Pendidikan ID"])) {
      const instansiExist =
        await masterInstansiPendidikanRepository.acquireById(
          obj["Instansi Pendidikan ID"]
        );
      if (!instansiExist) {
        returnedData.error.push({
          name: "InstansiPendidikanID",
          value: null,
          tipeData: typeof obj["Instansi Pendidikan ID"],
          status: false,
          keterangan: "INSTANSI PENDIDIKAN TIDAK TERDAFTAR DI MASTER",
        });
      }
    } else {
      returnedData.error.push({
        name: "InstansiPendidikanID",
        value: null,
        tipeData: typeof obj["Instansi Pendidikan ID"],
        status: false,
        keterangan: "INSTANSI PENDIDIKAN IN VALID",
      });
    }
  }

  // validasi Jenjang Pendidikan ID
  if (!obj["Jenjang Pendidikan ID"]) {
    returnedData.error.push({
      name: "JenjangPendidikanID",
      value: null,
      tipeData: typeof obj["Jenjang Pendidikan ID"],
      status: false,
      keterangan: "JENJANG PENDIDIKAN WAJIB DI ISI",
    });
  } else {
    if (onlyNumerical(obj["Jenjang Pendidikan ID"])) {
      const jenjangExist = await masterJenjangPendidikanRepository.acquireById(
        obj["Jenjang Pendidikan ID"]
      );
      if (!jenjangExist) {
        returnedData.error.push({
          name: "JenjangPendidikanID",
          value: null,
          tipeData: typeof obj["Jenjang Pendidikan ID"],
          status: false,
          keterangan: "JENJANG PENDIDIKAN TIDAK TERDAFTAR DI MASTER",
        });
      }
    } else {
      returnedData.error.push({
        name: "JenjangPendidikanID",
        value: null,
        tipeData: typeof obj["Jenjang Pendidikan ID"],
        status: false,
        keterangan: "JENJANG PENDIDIKAN IN VALID",
      });
    }
  }

  // validasi IPK
  if (!obj["IPK"]) {
    returnedData.error.push({
      name: "IPK",
      value: null,
      tipeData: typeof obj["IPK"],
      status: false,
      keterangan: "IPK WAJIB DI ISI",
    });
  } else {
    if (!validateGPA(obj["IPK"])) {
      returnedData.error.push({
        name: "IPK",
        value: null,
        tipeData: typeof obj["IPK"],
        status: false,
        keterangan: "IPK IN VALID",
      });
    }
  }

  // validasi Jurusan Pendidikan ID
  if (!obj["Jurusan Pendidikan ID"]) {
    returnedData.error.push({
      name: "JurusanPendidikanID",
      value: null,
      tipeData: typeof obj["Jurusan Pendidikan ID"],
      status: false,
      keterangan: "JURUSAN PENDIDIKAN WAJIB DI ISI",
    });
  } else {
    if (onlyNumerical(obj["Jurusan Pendidikan ID"])) {
      const jurusanExist = await masterJurusanPendidikanRepository.acquireById(
        obj["Jurusan Pendidikan ID"]
      );
      if (!jurusanExist) {
        returnedData.error.push({
          name: "JurusanPendidikanID",
          value: null,
          tipeData: typeof obj["Jurusan Pendidikan ID"],
          status: false,
          keterangan: "JURUSAN PENDIDIKAN TIDAK TERDAFTAR DI MASTER",
        });
      }
    } else {
      returnedData.error.push({
        name: "JurusanPendidikanID",
        value: null,
        tipeData: typeof obj["Jurusan Pendidikan ID"],
        status: false,
        keterangan: "JURUSAN PENDIDIKAN IN VALID",
      });
    }
  }

  // validasi Fakultas Pendidikan ID
  if (!obj["Fakultas Pendidikan ID"]) {
    returnedData.error.push({
      name: "FakultasPendidikanID",
      value: null,
      tipeData: typeof obj["Fakultas Pendidikan ID"],
      status: false,
      keterangan: "FAKULTAS PENDIDIKAN WAJIB DI ISI",
    });
  } else {
    if (onlyNumerical(obj["Fakultas Pendidikan ID"])) {
      const fakultasExist =
        await masterFakultasPendidikanRepository.acquireById(
          obj["Fakultas Pendidikan ID"]
        );
      if (!fakultasExist) {
        returnedData.error.push({
          name: "FakultasPendidikanID",
          value: null,
          tipeData: typeof obj["Fakultas Pendidikan ID"],
          status: false,
          keterangan: "FAKULTAS PENDIDIKAN TIDAK TERDAFTAR DI MASTER",
        });
      }
    } else {
      returnedData.error.push({
        name: "FakultasPendidikanID",
        value: null,
        tipeData: typeof obj["Fakultas Pendidikan ID"],
        status: false,
        keterangan: "FAKULTAS PENDIDIKAN IN VALID",
      });
    }
  }

  // validasi Tanggal Masuk
  if (!obj["Tanggal Masuk"]) {
    returnedData.error.push({
      name: "TanggalMasuk",
      value: null,
      tipeData: typeof obj["Tanggal Masuk"],
      status: false,
      keterangan: "TANGGAL MASUK WAJIB DI ISI",
    });
  }

  //validasi tanggal

  var tanggalMasuk = moment(
    excelSerialNumberToDate(obj["Tanggal Masuk"])
  ).format("YYYY-MM-DD");

  // if()

  if (!(await validationDate(tanggalMasuk))) {
    returnedData.error.push({
      name: "TanggalMasuk",
      value: null,
      tipeData: typeof obj["Tanggal Masuk"],
      status: false,
      keterangan: "TANGAL MASUK HARUS BERFORMAT TANGGAL",
    });
  }

  // validasi Tanggal Kelulusan
  if (!obj["Tanggal Kelulusan"]) {
    returnedData.error.push({
      name: "TanggalKelulusan",
      value: null,
      tipeData: typeof obj["Tanggal Kelulusan"],
      status: false,
      keterangan: "TANGGAL KELULUSAN WAJIB DI ISI",
    });
  }

  var TanggalKelulusan = moment(
    excelSerialNumberToDate(obj["Tanggal Kelulusan"])
  ).format("YYYY-MM-DD");

  // if()

  if (!(await validationDate(TanggalKelulusan))) {
    returnedData.error.push({
      name: "TanggalKelulusan",
      value: null,
      tipeData: typeof obj["Tanggal Kelulusan"],
      status: false,
      keterangan: "TANGAL KELULUSAN HARUS BERFORMAT TANGGAL",
    });
  }

  // validasi Nomor Ijazah
  if (!obj["Nomor Ijazah"]) {
    returnedData.error.push({
      name: "NomorIjazah",
      value: null,
      tipeData: typeof obj["Nomor Ijazah"],
      status: false,
      keterangan: "NOMOR IJAZAH WAJIB DI ISI",
    });
  }
  // else {
  //   if (onlyNumerical(obj["Nomor Ijazah"])) {
  //     returnedData.error.push({
  //       name: "NomorIjazah",
  //       value: null,
  //       tipeData: typeof obj["Nomor Ijazah"],
  //       status: false,
  //       keterangan: "NOMOR IJAZAH IN VALID",
  //     });
  //   }
  // }

  // validasi Gelar ID
  if (!obj["Gelar ID"]) {
    returnedData.error.push({
      name: "GelarID",
      value: null,
      tipeData: typeof obj["Gelar ID"],
      status: false,
      keterangan: "GELAR WAJIB DI ISI",
    });
  } else {
    if (onlyNumerical(obj["Gelar ID"])) {
      const gelarExist = await masterGelarPendidikanRepository.acquireById(
        obj["Gelar ID"]
      );
      if (!gelarExist) {
        returnedData.error.push({
          name: "GelarID",
          value: null,
          tipeData: typeof obj["Gelar ID"],
          status: false,
          keterangan: "GELAR TIDAK TERDAFTAR DI MASTER",
        });
      }
    } else {
      returnedData.error.push({
        name: "GelarID",
        value: null,
        tipeData: typeof obj["Gelar ID"],
        status: false,
        keterangan: "GELAR IN VALID",
      });
    }
  }

  // validasi Opsi
  if (!obj["Opsi"]) {
    returnedData.error.push({
      name: "Opsi",
      value: null,
      tipeData: typeof obj["Opsi"],
      status: false,
      keterangan: "OPSI WAJIB DI ISI",
    });
  }

  if (returnedData.error.length > 0) {
    returnedData.status = "Failure";
  }

  return returnedData;
};

const validateDataFamily = async (obj, i) => {
  try {

    const camelCaseObject = transformKeysToCamelCase(obj);
    let returnedData = {
      number_rows: parseInt(i) + 1,
      error: [],
      ...camelCaseObject,
      sheetName: "Data Keluarga",
      status: "Success",
      employeeId: null,
    };

    let isKdComTrue = false;

    // validasi NPP
    if (!obj.NPP) {
      returnedData.error.push({
        name: "NPP",
        value: null,
        tipeData: typeof obj.NPP,
        status: false,
        keterangan: "NPP WAJIB DI ISI",
      });
    }

    //Regex nama
    const regex = /^[a-zA-Z ]+$/;
    if (!regex.test(obj.NamaKeluarga)) {
      returnedData.error.push({
        name: "NPP",
        value: obj.NamaKeluarga,
        tipeData: typeof obj.NamaKeluarga,
        status: false,
        keterangan: "NAMA WAJIB HURUF",
      });
    }

    // validasi KD Comp ID
    if (!obj["KD Comp ID"]) {
      returnedData.error.push({
        name: "KDCompID",
        value: null,
        tipeData: typeof obj["KD Comp ID"],
        status: false,
        keterangan: "KD COMP WAJIB DI ISI",
      });
    } else {
      if (!onlyNumerical(obj["KD Comp ID"])) {
        isKdComTrue = true;
        returnedData.error.push({
          name: "KDCompID",
          value: null,
          tipeData: typeof obj["KD Comp ID"],
          status: false,
          keterangan: "KD COMP HARUS ANGKA",
        });
      } else if (onlyNumerical(obj["KD Comp ID"])) {
        const companyExist = await masterCompanyRepository.acquireById(
          obj["KD Comp ID"]
        );

        if (!companyExist) {
          returnedData.error.push({
            name: "KDCompID",
            value: null,
            tipeData: typeof obj["KD Comp ID"],
            status: false,
            keterangan: "KD COMP TIDAK TERDAFTAR DI MASTER",
          });
        }
      } else {
        returnedData.error.push({
          name: "KDCompID",
          value: null,
          tipeData: typeof obj["KD Comp ID"],
          status: false,
          keterangan: "KD COMP IN VALID",
        });
      }
    }



    // validasi NPP dan KD Comp ID
    if (obj.NPP && obj["KD Comp ID"] && !isKdComTrue) {

      const isEmployeeExist = await employeeRepository.acquireByNPPAndKdCompId(
        obj.NPP,
        obj["KD Comp ID"]
      );

      if (!isEmployeeExist) {
        // returnedData.error.push({
        //   name: "NPP",
        //   value: null,
        //   tipeData: typeof obj["NPP"],
        //   status: false,
        //   keterangan: `DATA KARYAWAN BELUM DI BUAT`,
        // });
        returnedData.error.push({
          name: "NPP",
          value: null,
          tipeData: typeof obj["NPP"],
          status: false,
          keterangan: `NPP BELUM TERDAFTAR`,
        });
      } else {
        returnedData.employeeId = isEmployeeExist.id;
        const profileData =
          await employeeProfileRepository.acquireOneByEmployeeId(
            returnedData.employeeId
          );

        if (profileData?.marital_status === "Lajang") {
          returnedData.error.push({
            name: "StatusKeluargaID",
            value: null,
            tipeData: typeof obj["Status Keluarga ID"],
            status: false,
            keterangan: `STATUS MASIH LAJANG`,
          });
        }
      }

    }

    // validasi Nama Keluarga
    if (!obj["Nama Keluarga"]) {
      returnedData.error.push({
        name: "NamaKeluarga",
        value: null,
        tipeData: typeof obj["Nama Keluarga"],
        status: false,
        keterangan: "NAMA KELUARGA WAJIB DI ISI",
      });
    }

    // const regexString = /^[a-zA-Z ]+$/;
    if (!regex.test(obj["Nama Keluarga"])) {
      returnedData.error.push({
        name: "NamaKeluarga",
        value: null,
        tipeData: typeof obj["Nama Keluarga"],
        status: false,
        keterangan: "NAMA KELUARGA HARUS BERUPA HURUF",
      });
    }

    // validasi Status Keluarga ID
    if (!obj["Status Keluarga ID"]) {
      returnedData.error.push({
        name: "StatusKeluargaID",
        value: null,
        tipeData: typeof obj["Status Keluarga ID"],
        status: false,
        keterangan: "STATUS KELUARGA WAJIB DI ISI",
      });
    } else {
      if (onlyNumerical(obj["Status Keluarga ID"])) {
        const statusExist = await masterStatusKeluargaRepository.acquireById(
          obj["Status Keluarga ID"]
        );

        if (!statusExist) {
          returnedData.error.push({
            name: "StatusKeluargaID",
            value: null,
            tipeData: typeof obj["Status Keluarga ID"],
            status: false,
            keterangan: "STATUS KELUARGA TIDAK TERDAFTAR DI MASTER",
          });
        }
      } else {
        returnedData.error.push({
          name: "StatusKeluargaID",
          value: null,
          tipeData: typeof obj["Status Keluarga ID"],
          status: false,
          keterangan: "STATUS KELUARGA IN VALID",
        });
      }
    }

    // let checkValidValue = true;

    // if (obj["Status Anak ke Berapa"]) {
    //   checkValidValue = containsOnlyNumbers(obj["Status Anak ke Berapa"]);
    // }

    // if (!checkValidValue) {
    //   returnedData.error.push({
    //     name: "StatusAnakKeBerapa",
    //     value: obj["Status Anak ke Berapa"],
    //     tipeData: typeof obj["Status Anak ke Berapa"],
    //     status: false,
    //     keterangan: "STATUS ANAK KE BERAPA WAJIB ANGKA",
    //   });
    // }

    if (
      obj["Status Keluarga ID"] === 2 ||
      obj["Status Keluarga ID"] === 21 ||
      obj["Status Keluarga ID"] === 22
    ) {
      if (!obj["Status Anak ke Berapa"]) {
        returnedData.error.push({
          name: "StatusAnakKeBerapa",
          value: null,
          tipeData: typeof obj["Status Anak ke Berapa"],
          status: false,
          keterangan: "STATUS ANAK KE BERAPA WAJIB DI ISI",
        });
      }

      if (!onlyNumerical(obj["Status Anak ke Berapa"])) {
        returnedData.error.push({
          name: "StatusAnakkeBerapa",
          value: obj["Status Anak ke Berapa"],
          tipeData: typeof obj["Status Anak ke Berapa"],
          status: false,
          keterangan: "STATUS ANAK HARUS ANGKA",
        });
      }
    } else if (
      obj["Status Keluarga ID"] !== 1 &&
      obj["Status Keluarga ID"] !== 10 &&
      obj["Status Keluarga ID"] !== 11 &&
      obj["Status Keluarga ID"] !== 12 &&
      obj["Status Keluarga ID"] !== 13
    ) {
      returnedData.error.push({
        name: "StatusKeluargaID",
        value: obj["Status Keluarga ID"],
        tipeData: typeof obj["Status Keluarga ID"],
        status: false,
        keterangan:
          "STATUS KELUARGA ID WAJIB DI ISI 1, 2, 10, 11, 12, 13, 21, 22",
      });
    }

    if (!obj["No KTP"]) {
      // validasi No KTP
      returnedData.error.push({
        name: "NoKTP",
        value: obj["No KTP"],
        tipeData: typeof obj["No KTP"],
        status: false,
        keterangan: "NO KTP WAJIB DI ISI",
      });
    } else {
      if (!onlyNumerical(obj["No KTP"])) {
        returnedData.error.push({
          name: "NoKTP",
          value: obj["No KTP"],
          tipeData: typeof obj["No KTP"],
          status: false,
          keterangan: "NO KTP IN VALID",
        });
      }

      if (obj["No KTP"].length !== 16) {
        returnedData.error.push({
          name: "NoKTP",
          value: obj["No KTP"],
          tipeData: typeof obj["No KTP"],
          status: false,
          keterangan: "NO KTP HARUS 16 DIGIT",
        });
      }

      if (obj["No KTP"].slice(-4) === "0000") {
        returnedData.error.push({
          name: "NoKTP",
          value: obj["No KTP"],
          tipeData: typeof obj["No KTP"],
          status: false,
          keterangan: "NO KTP IN VALID",
        });
      }

      // const checkNationalIdentifier =
      //   await employeeFamilyRepository.acquireByNationalIdentiifier(
      //     obj["No KTP"]
      //   );

      // if (checkNationalIdentifier) {
      //   returnedData.error.push({
      //     name: "KTP",
      //     value: null,
      //     tipeData: typeof obj["No KTP"],
      //     status: false,
      //     keterangan: "NO KTP SUDAH TERDAFTAR",
      //   });
      // }
    }

    // validasi Tempat Lahir
    if (!obj["Tempat Lahir"]) {
      returnedData.error.push({
        name: "TempatLahir",
        value: null,
        tipeData: typeof obj["Tempat Lahir"],
        status: false,
        keterangan: "TEMPAT LAHIR WAJIB DI ISI",
      });
    }

    // validasi Tanggal Lahir
    if (!obj["Tanggal Lahir"]) {
      returnedData.error.push({
        name: "TanggalLahir",
        value: null,
        tipeData: typeof obj["Tanggal Lahir"],
        status: false,
        keterangan: "TANGAL LAHIR WAJIB DI ISI",
      });
    }

    //validasi tanggal

    var tanggalLahir = moment(
      excelSerialNumberToDate(obj["Tanggal Lahir"])
    ).format("YYYY-MM-DD");

    console.log('tanggal lahir')

    if (!(await validationDate(tanggalLahir))) {
      returnedData.error.push({
        name: "TanggalLahir",
        value: null,
        tipeData: typeof obj["Tanggal Lahir"],
        status: false,
        keterangan: "TANGGAL LAHIR HARUS BERFORMAT TANGGAL",
      });
    }

    // validasi Jenis Kelamin
    if (!obj["Jenis Kelamin"]) {
      returnedData.error.push({
        name: "JenisKelamin",
        value: null,
        tipeData: typeof obj["Jenis Kelamin"],
        status: false,
        keterangan: "JENIS KELAMIN WAJIB DI ISI",
      });
    } else {
      if (
        obj["Jenis Kelamin"] !== "Laki-Laki" &&
        obj["Jenis Kelamin"] !== "Perempuan"
      ) {
        returnedData.error.push({
          name: "JenisKelamin",
          value: null,
          tipeData: typeof obj["Jenis Kelamin"],
          status: false,
          keterangan: "JENIS KELAMIN IN VALID",
        });
      }
    }

    // validasi Opsi
    if (!obj["Opsi"] || obj["Opsi"] !== "Tambah") {
      returnedData.error.push({
        name: "Opsi",
        value: obj["Opsi"],
        tipeData: typeof obj["Opsi"],
        status: false,
        keterangan: "OPSI WAJIB DI ISI TAMBAH",
      });
    }

    // validasi apakah sudah ada data family sebelumnya
    if (returnedData.employeeId && obj["Opsi"] === "Tambah") {
      const existingFamily =
        await employeeFamilyRepository.acquireByEmployeeIdAndNatIdentifier(
          returnedData.employeeId,
          obj["No KTP"]
        );

      if (existingFamily) {
        returnedData.error.push({
          name: "NoKTP",
          value: null,
          tipeData: typeof obj["No KTP"],
          status: false,
          keterangan: "DATA KTP SUDAH ADA",
        });
      }
    }

    if (returnedData.error.length > 0) {
      returnedData.status = "Failure";
    }

    return returnedData;
  } catch (e) {
    console.log(e)
  }

};

const onlyNumerical = (inputString) => {
  return /^\d+$/.test(inputString);
};

const validateGPA = (inputString) => {
  return /^([0-3](\.\d{1,2})?|4(\.00)?)$/.test(inputString);
};

const transformKeysToCamelCase = (obj) => {
  const transformedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/\s+/g, "");
      transformedObj[camelCaseKey] = obj[key];
    }
  }

  return transformedObj;
};

const validationDate = async (p) => {
  if (moment(p, "YYYY-MM-DD", true).isValid()) return true;
  return false;
};

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

function excelSerialNumberToDate(serialNumber) {
  const secondsInDay = 24 * 60 * 60; // Number of seconds in a day
  const millisecondsInDay = secondsInDay * 1000; // Number of milliseconds in a day

  // Adjust the serial number to account for the difference between Excel's base date and JavaScript's base date
  const excelBaseDate = new Date("1899-12-30"); // Excel's base date (December 30, 1899)
  const excelSerialOffset = excelBaseDate.getTime(); // Convert Excel's base date to milliseconds
  const excelSerialAdjusted =
    serialNumber * millisecondsInDay + excelSerialOffset;

  // Create a new Date object using the adjusted serial number
  const date = new Date(excelSerialAdjusted);

  return date;
}

const containsOnlyNumbers = (inputString) => {
  // Use a regular expression to test if the input string contains only numbers
  return /^\d+$/.test(inputString);
  // return /[^0-9]/.test(inputString);
};

module.exports = {
  validateDataPendidikan,
  validateDataFamily,
};
