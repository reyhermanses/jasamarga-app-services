const { MasterInstansiPendidikan } = require("../../../models");
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

  return await MasterInstansiPendidikan.findAndCountAll(filterAll);
};

async function acquireById(id) {
  return await MasterInstansiPendidikan.findOne({
    where: {
      id: id,
    },
  });
}

const generate = async (data) => {
  return await MasterInstansiPendidikan.create(data);
};

const modernize = async (id, data) => {
  return await MasterInstansiPendidikan.update(data, {
    where: {
      id: id,
    },
  });
};

const remove = async (id) => {
  return await MasterInstansiPendidikan.destroy({
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
