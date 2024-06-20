const service = require("../../services/master/masterPosition.service");
const templateRepository = require("../../repositories/template.repository");
const sendResponse = require("../../resources/responseApi");
const { validationResult } = require("express-validator");
const { sequelize } = require("../../../models");

async function getAll(req, res, next) {
  try {
    let data = await service.getAllData(req.query);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getJmClikBlankPosition = async (req, res, next) => {
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
    const data = await templateRepository.acquirePositionsBlankJmClick(
      req.query.company_id
    );
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

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

async function getByOrgId(req, res) {
  try {
    let data = await service.getDataByOrgId(req.params.id);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function create(req, res, next) {
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
    let insertedData = await service.createData(
      {
        ...req.body,
        konversi: req.body.grade,
        created_by: req.api_key.name,
      },
      transaction
    );
    await transaction.commit();
    return res.status(200).send(sendResponse.successCreate(insertedData));
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function update(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    let data = await service.getOneById(req.params.id);
    let hasEmployee = false;
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

      if (data.org_position.dataValues.is_sap) {
        return res
          .status(422)
          .send(
            sendResponse.unprocessableEntityError([
              { position_id: "position created by SAP is prohibited to edit" },
            ])
          );
      }

      if (data.position_employee.length > 0) {
        hasEmployee = true;
      }

      let updatedData = await service.updateData(
        data,
        req.params.id,
        req.body,
        req.api_key.name,
        hasEmployee,
        transaction
      );
      await transaction.commit();
      return res.status(200).send(sendResponse.successUpdate(updatedData));
    }
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function destroy(req, res) {
  const transaction = await sequelize.transaction();
  try {
    let searchData = await service.getOneById(req.params.id);
    if (!searchData) {
      return res.status(404).send(sendResponse.dataNotFoundException());
    } else {
      if (searchData.org_position.dataValues.is_sap) {
        return res
          .status(422)
          .send(
            sendResponse.unprocessableEntityError([
              {
                position_id: "position created by SAP is prohibited to deleted",
              },
            ])
          );
      }

      if (searchData.position_employee.length > 0) {
        return res
          .status(401)
          .send(sendResponse.unauthorized("posisi sedang ditempati employee"));
      }

      await service.destroyData(req.params.id, searchData, transaction);
      await transaction.commit();
      return res.status(201).send(sendResponse.successDelete(req.params.id));
    }
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

const paramsValidation = async (req, res, next) => {
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
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const updateMasterPositionJmClick = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const update = await service.updateMasterPositionJmClickData(
      req,
      transaction
    );
    await transaction.commit();
    return res.status(200).send(sendResponse.successUpdate(update));
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

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

module.exports = {
  getAll,
  getOne,
  create,
  update,
  destroy,
  getByOrgId,
  paramsValidation,
  getJmClikBlankPosition,
  updateMasterPositionJmClick,
  createMass,
};
