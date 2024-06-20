const { MasterSubCluster } = require("../../../models");
let moment = require("moment");
const { Op } = require("sequelize");

async function acquireAllData(filter = {}) {
  filter.attributes = {
    exclude: ["created_at", "updated_at", "created_by", "updated_by"],
  };
  return await MasterSubCluster.findAll(filter);
}

async function acquireById(id) {
  return await MasterSubCluster.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
}

async function acquireByIdClusterId(id, clusterId) {
  return await MasterSubCluster.findOne({
    where: {
      [Op.and]: [
        {
          id: id,
        },
        {
          cluster_id: clusterId,
        },
      ],
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
}

async function acquireByMasterClusterId(id) {
  return await MasterSubCluster.findOne({
    where: {
      cluster_id: id,
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
}

async function modernize(id, data) {
  return await MasterSubCluster.update(data, {
    where: {
      id: id,
    },
  });
}

async function generate(data) {
  return await MasterSubCluster.create(data);
}

async function remove(id) {
  return await MasterSubCluster.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
  acquireAllData,
  acquireById,
  generate,
  modernize,
  remove,
  acquireByMasterClusterId,
  acquireByIdClusterId,
};
