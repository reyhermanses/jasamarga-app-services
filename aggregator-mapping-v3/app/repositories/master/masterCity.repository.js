const { MasterCity, MasterProvince } = require("../../../models");
const { Op } = require("sequelize");
let moment = require("moment");

async function acquireAllData(filter = {}, provinceId) {
  filter.attributes = {
    exclude: ["created_at", "updated_at", "created_by", "updated_by"],
  };

  if (provinceId) filter.where = { province_id: provinceId };

  return await MasterCity.findAll(filter);
}

async function acquireById(id) {
  return await MasterCity.findOne({
    where: {
      id: id,
    },
    include: {
      model: MasterProvince,
      attributes: {
        exclude: ["created_at", "updated_at", "created_by", "updated_by"],
      },
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
}

async function acquireByDescription(desc) {
  return await MasterCity.findOne({
    where: {
      description: desc,
    },
  });
}

async function acquireProvinceById(id) {
  return await MasterProvince.findOne({
    where: {
      id: id,
    },
  });
}

async function generate(data) {
  return await MasterCity.create(data);
}

async function modernize(id, data) {
  return await MasterCity.update(data, {
    where: {
      id: id,
    },
  });
}

async function remove(id) {
  return await MasterCity.destroy({
    where: {
      id: id,
    },
  });
}

const acquiredByIDandProvinceID = async (id, province_id) => {
  return await MasterCity.findOne({
    where: {
      [Op.and]: [
        {
          id: id,
        },
        {
          province_id: province_id,
        },
      ],
    },
  });
};

module.exports = {
  acquireAllData,
  acquireById,
  acquireByDescription,
  generate,
  modernize,
  acquireProvinceById,
  remove,
  acquiredByIDandProvinceID,
};
