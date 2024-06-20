const { MasterGelarPendidikan } = require("../../../models");
const { Op } = require('sequelize')

const acquireAllData = async (filter = {}) => {
  let filterCol = []

  let filterAll = {
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    where: {
      [Op.and]: filterCol
    }
  };

  if (filter) {
    (filterAll.offset = filter.offset), (filterAll.limit = filter.limit);
    if (filter.name) {
      filterCol.push({
        name: {
          [Op.iLike]: `%${filter.name}%`,
        }
      })
    }
    if (filter.active) {
      filterCol.push({
        active: active
      })
    }
  }

  return await MasterGelarPendidikan.findAndCountAll(filterAll);
};

async function acquireById(id) {
  return await MasterGelarPendidikan.findOne({
    where: {
      id: id,
    },
  });
}

const generate = async (data) => {
  return await MasterGelarPendidikan.create(data);
};

const modernize = async (id, data) => {
  return await MasterGelarPendidikan.update(data, {
    where: {
      id: id,
    },
  });
};

const remove = async (id) => {
  return await MasterGelarPendidikan.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  acquireAllData,
  generate,
  modernize,
  remove,
  acquireById,
};
