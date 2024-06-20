const service = require("../services/family.service");
const sendResponse = require("../resources/responseApi");
const { validationResult } = require("express-validator");
const { sequelize } = require("../../models");
const minioClient = require("../../config/minio");

const moment = require("moment");
const path = require("path");
const crypto = require("crypto");

async function getAll(req, res) {
  try {
    let data = await service.getAllData(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getAllAlternate(req, res, next) {
  try {
    let data = await service.getAllDataAlternate(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
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

async function create(req, res, next) {
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

    if (req.files.attachment_ktp) {
      if (
        req.files.attachment_ktp[0].mimetype !== "image/png" &&
        req.files.attachment_ktp[0].mimetype !== "image/jpeg" &&
        req.files.attachment_ktp[0].mimetype !== "image/jpg"
      ) {
        const error = new Error("Only png or jpg files are allowed");
        error.statusCode = 422;
        throw error;
      }

      const fileName = crypto.randomBytes(64).toString("hex");
      minioClient.putObject(
        process.env.MINIO_BUCKET,
        `/file_family_ktp/${fileName}${path.extname(
          req.files.attachment_ktp[0].originalname
        )}`,
        req.files.attachment_ktp[0].buffer,
        function (error, etag) {
          if (error) {
            throw new Error(
              `Something went wrong when uploading to Minio : ${error}`
            );
          }
        }
      );
      req.body.attachment_ktp = `/file_fam_ktp/${fileName}${path.extname(
        req.files.attachment_ktp[0].originalname
      )}`;
    }

    req.body.created_by = req.api_key.name;
    req.body.active = true;

    let insertedData = await service.createData(req.body);

    return res
      .status(201)
      .send(sendResponse.successCreate(insertedData.dataValues.id));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
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

async function update(req, res, next) {
  const t = await sequelize.transaction();
  try {
    let data = await service.getOneById(req.params.id);
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException());
    } else {
      if (req.files.attachment_ktp) {
        if (
          req.files.attachment_ktp[0].mimetype !== "image/png" &&
          req.files.attachment_ktp[0].mimetype !== "image/jpeg" &&
          req.files.attachment_ktp[0].mimetype !== "image/jpg"
        ) {
          const error = new Error("Only png or jpg files are allowed");
          error.statusCode = 422;
          throw error;
        }

        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/file_family_ktp/${fileName}${path.extname(
            req.files.attachment_ktp[0].originalname
          )}`,
          req.files.attachment_ktp[0].buffer,
          function (error, etag) {
            if (error) {
              throw new Error(
                `Something went wrong when uploading to Minio : ${error}`
              );
            }
          }
        );
        req.body.attachment_ktp = `/file_fam_ktp/${fileName}${path.extname(
          req.files.attachment_ktp[0].originalname
        )}`;
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
    await t.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  getAll,
  getOne,
  destroy,
  create,
  update,
  getAllAlternate,
  paramsValidation,
};
