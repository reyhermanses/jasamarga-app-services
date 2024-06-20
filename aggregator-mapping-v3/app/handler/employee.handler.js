const service = require("../services/employee.service");
const sendResponse = require("../resources/responseApi");
const { validationResult } = require("express-validator");
const { sequelize } = require("../../models");

async function getAll(req, res) {
  try {
    let data = await service.getAllData(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getTemplateExcel(req, res) {
  try {
    await service.getTemplateExcelData();
    return res.status(200).download("Master Aggregator.xlsx");
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getOne(req, res) {
  try {
    let data = await service.getOneById(req.params.id);
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException());
    } else {
      return res.status(200).send(sendResponse.successGet(data));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getByHierarchy(req, res) {
  try {
    const data = await service.getOneById(req.params.id);
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException());
    } else {
      const dataHierarchy = await service.getDataHierarchy(data, req);
      return res.status(200).send(sendResponse.successGet(dataHierarchy));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getOneByJabatan(req, res) {
  try {
    let data = await service.getHistoryJabatanById(req.params.id);
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException());
    } else {
      return res.status(200).send(sendResponse.successGet(data));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getByCompany(req, res) {
  try {
    res
      .status(200)
      .send(sendResponse.successGet(await service.getDataByCompany(req)));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getOneByCompany(req, res) {
  try {
    res
      .status(200)
      .send(
        sendResponse.successGet(
          await service.getOneDataByCompany(req.params.id)
        )
      );
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getOneByOrg(req, res) {
  try {
    switch (req.query.relation) {
      case "direktorat":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getOneDataByDirektorat(req))
          );
        break;
      case "unit_kerja":
        res
          .status(200)
          .send(sendResponse.successGet(await service.getOneDataByUnit(req)));
        break;
      case "departement":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getOneDataByDepartement(req))
          );
        break;
      case "organization":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getOneDataByOrganization(req))
          );
        break;
      default:
        res.status(404).send(sendResponse.NotFoundHttpException());
        break;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getOneByOrgLearning(req, res) {
  try {
    switch (req.query.relation) {
      // case "direktorat":
      //   res
      //     .status(200)
      //     .send(
      //       sendResponse.successGet(await service.getOneDataByDirektorat(req))
      //     );
      //   break;
      case "unit_kerja":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getOneDataByUnitLearning(req))
          );
        break;
      // case "departement":
      //   res
      //     .status(200)
      //     .send(
      //       sendResponse.successGet(await service.getOneDataByDepartement(req))
      //     );
      //   break;
      // case "organization":
      //   res
      //     .status(200)
      //     .send(
      //       sendResponse.successGet(await service.getOneDataByOrganization(req))
      //     );
      //   break;
      default:
        res.status(404).send(sendResponse.NotFoundHttpException());
        break;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getByOrg(req, res) {
  // console.log(req.query.unit_kerja_id);
  try {
    switch (req.query.relation) {
      case "direktorat":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getDataByDirektorat(req))
          );
        break;
      case "unit_kerja":
        res
          .status(200)
          .send(sendResponse.successGet(await service.getDataByUnit(req)));
        break;
      case "departement":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getDataByDepartement(req))
          );
        break;
      case "organization":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getDataByOrganization(req))
          );
        break;
      default:
        res.status(404).send(sendResponse.NotFoundHttpException());
        break;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getByOrgLearning(req, res) {
  try {
    switch (req.query.relation) {
      // case "direktorat":
      //   res
      //     .status(200)
      //     .send(
      //       sendResponse.successGet(await service.getDataByDirektorat(req))
      //     );
      //   break;
      case "unit_kerja":
        res
          .status(200)
          .send(
            sendResponse.successGet(await service.getDataByUnitLearning(req))
          );
        break;
      // case "departement":
      //   res
      //     .status(200)
      //     .send(
      //       sendResponse.successGet(await service.getDataByDepartement(req))
      //     );
      //   break;
      // case "organization":
      //   res
      //     .status(200)
      //     .send(
      //       sendResponse.successGet(await service.getDataByOrganization(req))
      //     );
      //   break;
      default:
        res.status(404).send(sendResponse.NotFoundHttpException());
        break;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

const createMass = async (req, res, next) => {
  // const transaction = await sequelize.transaction();
  try {
    let data = await service.createMassData(req);
    // await transaction.commit();
    return res.status(200).send(sendResponse.successGet(data));
    // return res.status(200).download("Aggregator Result Masal.xlsx");
  } catch (error) {
    // await transaction.rollback();
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
};

const createMassJabatan = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

async function create(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const extractedErrors = [];
      errors.array().map((err) =>
        extractedErrors.push({
          [err.param]: err.msg,
        })
      );
      return res
        .status(422)
        .send(sendResponse.unprocessableEntityError(extractedErrors));
    }

    req.body.created_by = req.api_key.name;

    let insertedData = await service.createData(req.body, transaction);
    await transaction.commit();
    return res
      .status(200)
      .send(sendResponse.successCreate(insertedData.dataValues.id));
  } catch (error) {
    await transaction.rollback();
    console.log(error.message);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function update(req, res) {
  const t = await sequelize.transaction();
  try {
    let data = await service.getOneById(req.params.id);
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException());
    } else {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors.array().map((err) =>
          extractedErrors.push({
            [err.param]: err.msg,
          })
        );
        return res
          .status(422)
          .send(sendResponse.unprocessableEntityError(extractedErrors));
      }
      let updatedData = await service.updateData(
        req.params.id,
        req.body,
        req.api_key.name
      );
      await t.commit();
      return res.status(200).send(sendResponse.successUpdate(updatedData));
    }
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function destroy(req, res) {
  try {
    let searchData = await service.getOneById(req.params.id);
    if (!searchData) {
      return res.status(404).send(sendResponse.dataNotFoundException());
    } else {
      await service.destroyData(req.params.id);
      return res.status(201).send(sendResponse.successDelete(req.params.id));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

const getEmployeeLearning = async (req, res, next) => {
  try {
    let searchData = await service.getEmployeeLearning(req, res);
    return res.status(200).send(sendResponse.successGet(searchData));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  destroy,
  getByOrg,
  getOneByOrg,
  getByCompany,
  getOneByJabatan,
  getByHierarchy,
  getOneByCompany,
  createMass,
  getTemplateExcel,
  createMassJabatan,
  getEmployeeLearning,
  getOneByOrgLearning,
  getByOrgLearning,
};
