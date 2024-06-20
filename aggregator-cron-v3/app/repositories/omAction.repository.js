const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

const {
  Employee,
  EmployeePosition,
  MasterPosition,
  HistoryJabatan,
  OrganizationHierarchy,
  UserAuth,
  MasterEmployeeSubGroup,
  MasterJob,
  UnitDirektoratRelation,
  sequelize,
} = require("../../models");

const { Op, where } = require("sequelize");

const acquireData = async (changeDate = null) => {
  const response = await axios.post(
    changeDate
      ? `${process.env.SAP_URL}` +
      `&sat-table=JM_OM_ACTION2&mode=16&changedate=` +
      changeDate
      : process.env.SAP_URL +
      `&sat-table=JM_OM_ACTION2&mode=16&changedate=` +
      moment().add(-1, "days").format("YYYYMMDD"),
    {},
    {
      auth: {
        username: process.env.SAP_USER,
        password: process.env.SAP_PASSWORD,
      },
    }
  );
  return response;
};

const acquireDirektorat = async (unitId) => {
  return await UnitDirektoratRelation.findOne({ where: { id: unitId } });
};

const acquireDatabase = async (persNumbers) => {
  const newData = await Employee.findAll({
    include: [
      {
        model: EmployeePosition,
        as: "position",
        where: {
          is_main: true,
          personnel_number: persNumbers,
        },
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
    ],
    where: {
      is_pusat: true,
    },
  });

  return newData[0];
};

const acquireDatabasePersNumbers = async (persNumbers) => {
  const newData = await Employee.findOne({
    where: {
      is_pusat: true,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        where: {
          [Op.and]: [
            {
              personnel_number: persNumbers,
            },
          ],
        },
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
    ],
  });
  return newData;
};

const acquireDataBankDetails = async (persNumbers) => {
  const newData = await Employee.findOne({
    where: {
      is_pusat: true,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        where: {
          [Op.and]: [
            {
              personnel_number: persNumbers,
            },
            {
              is_main: true,
            },
          ],
        },
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
    ],
  });
  return newData;
};

const acquireAllEmp = async (empId) => { // add 01/17/2023
  // const nppValues = [7949,
  //   7988,
  //   8098,
  //   8043,
  //   1107,
  //   8037,
  //   8017,
  //   7971]

  return await Employee.findAll({
    where: {
      [Op.and]: [
        {
          is_pusat: true,
          // id: 8117
          // id:{
          //   [Op.in]: nppValues
          // }
        }

      ]
    }
  })
}

const acquireEmpPos = async (empId) => {
  return await EmployeePosition.findOne({
    where: {
      employee_id: empId
    }
  })
}

const acquireEmpHistory = async (empId) => {
  return await HistoryJabatan.findOne({
    where: {
      employee_id: empId
    }
  })
}

const acquireDataEspt = async () => {
  let filterAll = {
    attributes: [
      "id",
      "employee_status",
      ["company_id_asal", "company_id"],
      [sequelize.literal(`"position"."position_id"`), "position_id"],
      [sequelize.literal(`"position"."npp"`), "npp"],
      [sequelize.literal(`"position"."personnel_number"`), "personnel_number"],
      // [sequelize.literal(`"position"."company_id_asal"`), "company_id"],
    ],
    where: {
      [Op.and]: [{ is_pusat: true }
        // , { employee_status: true }
      ],
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
    ],
  };

  filterAll.include[0].attributes = [];
  return await Employee.findAll(filterAll);
};

const acquireDataPayslip = async (npp) => {
  const prefix = 0;
  let filterAll = {
    // offset: 10,
    // limit: 10,
    attributes: [
      "id",
      "company_id_asal",
      [sequelize.col("position.npp"), "npp"],
      [sequelize.col("position.personnel_number"), "personnel_number"],
      [sequelize.col("position.position_id"), "position_id"],
    ],
    where: {
      [Op.and]: [
        {
          company_id_asal: 1,
        },
        {
          employee_status: true,
        },
      ],
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
      },
    ],
  };

  if (npp) {
    filterAll.include[0].where = {
      npp: npp,
    };
  }

  return await Employee.findAll(filterAll);
};

const acquirePosition = async (positionId) => {
  return await MasterPosition.findByPk(positionId, {
    raw: true,
  });
};

const upsertPosition = async (id, data) => {
  return await MasterPosition.findByPk(id).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-cron";
      return obj.update(data);
    }

    data.created_by = "aggregator-cron";
    return MasterPosition.create(data);
  });
};

const acquireDataOrganization = async (orgId) => {
  return await OrganizationHierarchy.findByPk(orgId, {
    raw: true,
  });
};

const generateHistoryJabatan = async (data) => {
  return await HistoryJabatan.create(data);
};

const upsertAuth = async (data) => {
  return await UserAuth.findOne({
    where: {
      employee_id: data.employee_id,
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-cron";
      return obj.update(data);
    }
    data.created_by = "aggregator-cron";
    return UserAuth.create(data);
  });
};

const upsertEmployeePosition = async (data) => {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
        {
          is_main: true,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-cron";
      return obj.update(data);
    }
    data.created_by = "aggregator-cron";
    return EmployeePosition.create(data);
  });
};

const modernizeEmployee = async (id, data) => {
  return await Employee.update(data, {
    where: {
      id: id,
    },
  });
};

const modernizeLeaderOrganization = async (leaderId) => {
  return await OrganizationHierarchy.update(
    {
      leader_id: null,
      leader_position_id: null,
      updated_by: "aggregator-cron",
    },
    {
      where: {
        leader_id: leaderId,
      },
    }
  );
};

const generateEmployee = async (data) => {
  return await Employee.create(data);
};

const acquireSubGroupByKey = async (key) => {
  return await MasterEmployeeSubGroup.findOne({
    where: {
      key: key,
    },
  });
};

const upsertSubGroup = async (data) => {
  const findData = await MasterEmployeeSubGroup.findOne({
    where: { id: data.id },
  });
  if (findData) {
    findData.subgroup = data.subgroup;
    findData.active = true;
    findData.updated_by = "aggregator-cron";
    await findData.save();
  } else {
    await MasterEmployeeSubGroup.create({
      ...data,
      active: true,
      created_by: "aggregator-cron",
    });
  }
};

const upsertJob = async (data) => {
  const findData = await MasterJob.findOne({ where: { id: data.id } });
  if (findData) {
    findData.name = data.name;
    findData.active = true;
    findData.updated_by = "aggregator-cron";
    await findData.save();
  } else {
    await MasterJob.create({
      ...data,
      active: true,
      created_by: "aggregator-cron",
    });
  }
  return data;
};

const removeEmployeePosition = async (empId) => {
  return await EmployeePosition.destroy({ where: { employee_id: empId } });
};


module.exports = {
  acquireData,
  acquireDatabase,
  acquirePosition,
  upsertPosition,
  generateHistoryJabatan,
  upsertAuth,
  acquireDataOrganization,
  upsertEmployeePosition,
  modernizeEmployee,
  generateEmployee,
  acquireSubGroupByKey,
  acquireDataPayslip,
  acquireDataBankDetails,
  acquireDataEspt,
  acquireDatabasePersNumbers,
  upsertJob,
  acquireDirektorat,
  upsertSubGroup,
  removeEmployeePosition,
  modernizeLeaderOrganization,
  acquireAllEmp,
  acquireEmpPos,
  acquireEmpHistory
};
