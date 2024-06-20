const { Op, literal } = require("sequelize");

const { PendingRequest } = require("../../models");

const upsert = async (data) => {
  const searchData = await PendingRequest.findOne({
    where: {
      personnel_number: data.personnel_number,
      tanggal_efektif_sk: data.tanggal_efektif_sk,
    },
  });

  if (!searchData) {
    return await PendingRequest.create(data);
  }
  return await searchData.update(data);
};

const acquireByPeriod = async (period, persNumber) => {
  let filter = {
    period,
  };

  if (persNumber) {
    filter.personnel_number = persNumber;
  }

  return await PendingRequest.findAll({
    where: filter,
    raw: true,
  });
};

const acquireCurrent = async (dateString) => {
  return await PendingRequest.findAll({
    where: {
      period: {
        [Op.gte]: literal(`to_date('${dateString}', 'YYYYMMDD')`),
      },
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    raw: true,
  });
};

const GetAllPendingRequest = async () => {
  return await PendingRequest.findAll({
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    raw: true,
  });
}

module.exports = {
  upsert,
  acquireByPeriod,
  acquireCurrent,
  GetAllPendingRequest
};
