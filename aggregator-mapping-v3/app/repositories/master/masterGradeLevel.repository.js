const {
  MasterGradeLevel,
  MasterEmployeeSubGroup,
  sequelize,
} = require("../../../models");

const { Op } = require("sequelize");

const acquireAllData = async (filter = {}, filterData = null) => {
  let filterAll = {
    attributes: {
      include: [[sequelize.col("level_subgroup.subgroup"), "subgroup_name"]],
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [
      {
        model: MasterEmployeeSubGroup,
        as: "level_subgroup",
        attributes: [],
      },
    ],
  };

  if (filter) {
    (filterAll.offset = filter.offset), (filterAll.limit = filter.limit);
  }

  if (filterData) {
    let filterFinalData = [];

    for (let [key, value] of Object.entries(filterData)) {
      filterFinalData.push({ [key]: value });
    }

    filterAll.where = {
      [Op.and]: filterFinalData,
    };
  }

  return await MasterGradeLevel.findAndCountAll(filterAll);
};

const acquireById = async (id) => {
  return await MasterGradeLevel.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [
      {
        model: MasterEmployeeSubGroup,
        as: "level_subgroup",
        attributes: {
          exclude: ["created_at", "updated_at", "created_by", "updated_by"],
        },
      },
    ],
  });
};

const acquireBySubgroupId = async (subgroupId) => {
  return await MasterGradeLevel.findOne({
    where: {
      subgroup_id: subgroupId,
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
};

const acquireByGradeLvlSublvlSubgroupId = async (filter) => {
  let filterAll = {};
  let filterGradeLevel = [];

  if (filter) {
    // delete query.limit
    let keys = Object.keys(filter);
    let values = Object.values(filter);

    for (let i = 0; i < keys.length; i++) {
      let obj = {};
      if (keys[i] === "grade") {
        obj[keys[i]] = {
          [Op.like]: `%${values[i]}%`,
        };
        filterGradeLevel.push(obj);
      }

      if (keys[i] === "level") {
        obj[keys[i]] = {
          [Op.like]: `%${values[i]}%`,
        };
        filterGradeLevel.push(obj);
      }

      if (keys[i] === "sublevel") {
        obj[keys[i]] = {
          [Op.like]: `%${values[i]}%`,
        };
        filterGradeLevel.push(obj);
      }

      if (keys[i] === "subgroup_id") {
        obj[keys[i]] = values[i];
        filterGradeLevel.push(obj);
      }

      if (keys[i] === "kelompok_jabatan") {
        obj[keys[i]] = values[i];
        filterGradeLevel.push(obj);
      }
    }
    if (filterGradeLevel.length != 0) {
      filterAll.where = {
        [Op.and]: filterGradeLevel,
      };
    }
  }
  const result = await MasterGradeLevel.findOne(filterAll);
  if (!result) {
    return false;
  }
  return true;
};

const generate = async (data) => {
  return await MasterGradeLevel.create(data);
};

const modernize = async (id, data) => {
  return await MasterGradeLevel.update(data, {
    where: {
      id: id,
    },
  });
};

const remove = async (id) => {
  return await MasterGradeLevel.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  acquireAllData,
  acquireById,
  acquireBySubgroupId,
  generate,
  modernize,
  remove,
  acquireByGradeLvlSublvlSubgroupId,
};
