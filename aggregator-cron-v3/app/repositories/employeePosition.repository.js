const {
  EmployeePosition,
  Employee,
  MasterPosition,
  MasterCompany,
  sequelize,
} = require("../../models");

const { Op, where } = require("sequelize");

const checkNPP = async (positionID, npp) => {
  const dataPosition = await MasterPosition.findByPk(positionID);
  if (dataPosition) {
    const check = await EmployeePosition.findOne({
      where: { npp },
      include: [
        {
          model: MasterPosition,
          as: "position_detail",
          where: {
            company_id: dataPosition.company_id,
          },
        },
      ],
    });
    if (check) {
      return false;
    }
  }
  return true;
};

async function acquireByNppPositionId(npp, position_id) {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          npp: `${npp}`,
        },
        {
          position_id: position_id,
        },
      ],
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
  // .then(obj => {
  //   if (!obj) {
  //     // console.log(obj)
  //     // throw new Error('error field');
  //     console.log(error)
  //   }
  // })
}

const acquireAllData = async (filter) => {
  let filterAll = {
    attributes: {
      include: [
        "npp",
        [
          sequelize.literal(`"position_detail->company_position"."kd_comp"`),
          "kd_comp",
        ],
        [sequelize.literal(`"employee_position"."name"`), "employee_name"],
      ],
      exclude: ["created_by", "created_at", "updated_by", "updated_at"],
    },
    include: [
      {
        model: MasterPosition,
        as: "position_detail",
        attributes: [],
        include: [
          {
            model: MasterCompany,
            as: "company_position",
            attributes: [],
          },
        ],
      },
      {
        model: Employee,
        as: "employee_position",
        attributes: [],
      },
    ],
  };
  if (filter) {
    let cleanFilter = [];

    for (obj of Object.keys(filter)) {
      if (obj == "name") {
        filterAll.include[1].where = {
          name: {
            [Op.iLike]: `%${filter[obj]}%`,
          },
        };
        filterAll.include[1].required = true;
      } else if (obj == "kd_comp") {
        filterAll.include[0].include[0].where = {
          kd_comp: filter[obj],
        };
        filterAll.include[0].include[0].required = true;
        filterAll.include[0].required = true;
      } else {
        let object = {};
        object[obj] = filter[obj];
        cleanFilter.push(object);
      }
    }
    filterAll.where = {
      [Op.and]: cleanFilter,
    };
  }

  return await EmployeePosition.findAll(filterAll);
};

const acquireEmployeeById = async (id) => {
  return await Employee.findByPk(id);
};

const acquireByEmployeeIdAndPositionId = async (empId, posId) => {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: empId,
        },
        {
          position_id: posId,
        },
      ],
    },
  });
};

const acquiredByNppAndPositionId = async (npp, posId) => {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          npp: npp,
        },
        {
          position_id: posId,
        },
      ],
    },
  });
};

const acquireMainPositionEmployee = async (empId) => {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: empId,
        },
        {
          is_main: true,
        },
      ],
    },
  });
};

const acquireByPositionId = async (id) => {
  return await EmployeePosition.findOne({
    where: {
      position_id: id,
    },
  });
};

const generate = async (data, transaction) => {
  return await EmployeePosition.create(data, { transaction });
};

const modernize = async (id, data) => {
  return await EmployeePosition.update(data, {
    where: {
      id: id,
    },
    returning: true,
  });
};

const updateMasalByEmployeeId = async (employee_id, data) => {
  return await EmployeePosition.update(data, {
    where: {
      employee_id: employee_id,
    },
    returning: true,
  });
};

const upsertMasal = async (data) => {
  return EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
        {
          position_id: data.position_id,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "update-masal";
      return obj.update(data);
    }
    data.created_by = "create-masal";
    return EmployeePosition.create(data);
  });
};

const acquireById = async (id) => {
  return await EmployeePosition.findByPk(id, {
    attributes: ["id"],
    raw: true,
  });
};

const remove = async (id) => {
  return await EmployeePosition.destroy({
    where: {
      id: id,
    },
  });
};

const acquireByNppIsMain = async (npp) => {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          npp: npp,
        },
        {
          is_main: true,
        },
      ],
    },
  });
};

const acquireByPernr = async (pernr) => {
  return await EmployeePosition.findOne({
    where: {
      personnel_number: pernr,
    },
  });
};

module.exports = {
  acquireAllData,
  acquireEmployeeById,
  acquireMainPositionEmployee,
  generate,
  modernize,
  acquireById,
  remove,
  acquireByNppPositionId,
  upsertMasal,
  acquireByEmployeeIdAndPositionId,
  updateMasalByEmployeeId,
  acquireByPositionId,
  checkNPP,
  acquiredByNppAndPositionId,
  acquireByNppIsMain,
  acquireByPernr,
};
