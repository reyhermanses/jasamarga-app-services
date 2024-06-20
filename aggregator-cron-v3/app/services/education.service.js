const repository = require("../repositories/education.repository");
const moment = require("moment");

const getData = async (req) => {
  // Ambil dengan dan tanpa req.query.changedate, jika tanpa req.query.changedate maka akan mengambil data kemarin
  let responseJson = await repository.acquireData(
    req.query.changedate ? req.query.changedate : null
  );
  if (responseJson.data.length != 0) {
    let responseFiltered = responseJson.data;

    if (typeof responseFiltered == "string") {
      let removeBacklash = responseFiltered.replaceAll(/\\/g, "").toLowerCase();

      // case "VETERAN" / "Veteran" remove ""
      let removeVeteranQuotation = removeBacklash.replaceAll(
        '"veteran"',
        "veteran"
      );
      responseFiltered = JSON.parse(removeVeteranQuotation);
    }

    // Jalankan Manual dengan Personnel Number
    if (req.query.personnel_number) {
      var obj = responseFiltered.filter((row) => {
        return row.personnel_number == req.query.personnel_number;
      });
      if (obj.length == 0) {
        const error = new Error("Personnel Number not found");
        error.statusCode = 404;
        throw error;
      }
      responseFiltered = obj;
    }

    const finalData = responseFiltered.map((obj) => {
      for (const key in obj) {
        if (
          obj[key] === "99999999" ||
          obj[key] === "00000000" ||
          obj[key] === ""
        ) {
          delete obj[key];
        }
      }
      return obj;
    });

    const result = await processCron(finalData, req);
    return result;
  } else {
    return [];
  }
};

const processCron = async (responseFiltered, req) => {
  let result = [];
  // remove all employee's education
  const uniqueArray = responseFiltered.reduce((uniqueItems, currentItem) => {
    const isPersonnelNumberAlreadyAdded = uniqueItems.some(
      (item) => item.personnel_number === currentItem.personnel_number
    );
    if (!isPersonnelNumberAlreadyAdded) {
      uniqueItems.push(currentItem);
    }
    return uniqueItems;
  }, []);
  // replace all employee's education
  for (const element of uniqueArray) {
    let search = await repository.acquireDataPusat(element.personnel_number);
    if (search) {
      await repository.remove(search.employee_id);
    }
  }

  for (element of responseFiltered) {
    let search = await repository.acquireDataPusat(element.personnel_number);
    if (search) {
      let dataCountry = await repository.acquireCountry(
        element.country.toLowerCase()
      );
      let data = {
        employee_id: search.employee_id,
        ref_jenjang_pendidikan_id: element.level_pendidikan,
        ref_jurusan_pendidikan_id: element.code_jurusan
          ? parseInt(element.code_jurusan)
          : null,
        fakultas_pendidikan_id: element.code_fakultas
          ? parseInt(element.code_fakultas)
          : null,
        country_id: dataCountry.id,
        name: element.institusi_penyelenggara,
        start_date: moment(element.begin_date).format("YYYY-MM-DD"),
        graduate_date: moment(element.end_date).format("YYYY-MM-DD"),
        // to be discuss
        title: element.title,
        no_ijazah: element.no_certificate,
        // to be discuss
        tanggal_ijazah: element.tanggal_ijazah,
        final_score: element.final_grade,
        // to be discuss
        education_degree: element.education_degree,
        changedate: req.query.changedate
          ? req.query.changedate
          : moment().add(-1, "days").format("YYYYMMDD"),
        created_by: "aggregator-cron",
      };
      const newEducation = await repository.upsertEducation(data);

      // update last education
      await repository.upsertLastEducation({
        employee_id: search.employee_id,
        last_education_id: newEducation.id,
      });
      result.push(element);
    }
  }

  return result;
};

module.exports = {
  getData,
};
