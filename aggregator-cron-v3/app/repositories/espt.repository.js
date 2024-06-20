const { Espt, Employee } = require("../../models");

require("dotenv").config();

let axios = require("axios");

const { Op } = require("sequelize");

async function acquiredSap(dateNow, npp) {
  const response = await axios.post(
    `${process.env.SAP_URL}` +
    `&mode=07&changedate=` +
    dateNow +
    `&pernr=` +
    npp,
    {},
    {
      auth: {
        username: `${process.env.SAP_USER}`,
        password: `${process.env.SAP_PASSWORD}`,
      },
    }
  );
  return response;
}

async function upsert(data) {
  return await Espt.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
        {
          tahun_pajak: data.tahun_pajak,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-data";
      console.log("udpated");
      return obj.update(data);
    }
    console.log("created");
    data.created_by = "aggregator-data";
    return Espt.create(data);
  });
}

async function acquiredAllDataEspt(npp = null, kd_comp = null) {
  let filterAll = {
    attributes: ["id", "npp", "name", "company_id_asal"],
    include: [
      {
        model: Espt,
        as: "espt",
      },
    ],
  };

  let where = {
    [Op.and]: [
      {
        npp: npp,
      },
      {
        company_id_asal: kd_comp,
      },
    ],
  };

  filterAll.where = where;

  return Employee.findOne(filterAll);
}

async function acquireTahunPajakEmployeeId(tahun_pajak, employee_id) {
  let filterAll = {
    where: {
      [Op.and]: [
        {
          tahun_pajak: tahun_pajak,
        },
        {
          employee_id: employee_id,
        },
      ],
    },
  };

  return await Espt.findOne(filterAll);
}

module.exports = {
  acquiredSap,
  acquiredAllDataEspt,
  upsert,
  acquireTahunPajakEmployeeId,
};
