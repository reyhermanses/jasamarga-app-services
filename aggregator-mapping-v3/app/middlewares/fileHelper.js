var Multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
let moment = require("moment");
const fs = require("fs");
const { join } = require("path");
const crypto = require("crypto");

const minioClient = require("../../config/minio");
const sendResponse = require("../resources/responseApi");
const userRepository = require("../repositories/employee.repository");
const masterPositionRepository = require("../repositories/master/masterPosition.repository");
const employeePositionRepository = require("../repositories/employeePosition.repository");

dotenv.config();

const S3Stream = Multer.memoryStorage();

const streamFormJmClickUpdateMobility = Multer({ storage: S3Stream }).fields([
  {
    name: "file_sk",
    maxCount: 1,
  },
]);

const streamFormJmClickUpdateFamily = Multer({ storage: S3Stream }).fields([
  {
    name: "attachment_ktp",
    maxCount: 1,
  },
]);

const upload = Multer({
  storage: S3Stream,
  limits: { fileSize: 2 * 1000 * 1000 },
  fileFilter: function (_req, file, cb) {
    checkAttachmentType(file, cb);
  },
}).fields([
  {
    name: "profile",
    maxCount: 1,
  },
  {
    name: "attachment_kk",
    maxCount: 1,
  },
  {
    name: "attachment_ktp",
    maxCount: 1,
  },
  {
    name: "attachment_bpjs_ket",
    maxCount: 1,
  },
  {
    name: "attachment_bpjs_kes",
    maxCount: 1,
  },
  {
    name: "attachment_npwp",
    maxCount: 1,
  },
  {
    name: "attachment_buku_nikah",
    maxCount: 1,
  },
  {
    name: "attachment_dana_pensiun",
    maxCount: 1,
  },
  {
    name: "file_sk",
    maxCount: 1,
  },
]);

const save = Multer({
  storage: S3Stream,
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).single("upload");

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /xlsx|csv/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb("Excel File Only!", false);
  }
}

function checkAttachmentType(file, cb) {
  // Allowed ext
  const filetypes = /png|jpg|jpeg|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(".png, .jpg, .jpeg or .pdf File Only!");
  }
}

async function uploadToDisk(req, res, next) {
  try {
    save(req, res, (err) => {
      if (err) {
        return res.status(400).send(sendResponse.unprocessableEntityError(err));
      }
      minioClient.putObject(
        process.env.MINIO_BUCKET,
        `/MassUpload/${req.file.originalname}`,
        req.file.buffer,
        function (error, etag) {
          if (error) {
            console.log(error);
            const e = {
              message: error,
              code: 500,
            };
            return reject(e);
          }
        }
      );
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function uploadAttachment(req, res, next) {
  uploadProcess(req, res)
    .then((result) => {
      req.filenames = result;
      next();
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = err.code;
      next(error);
    });
}

async function uploadProcess(req, res) {
  return new Promise((resolve, reject) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        const e = {
          message: err,
          code: 500,
        };
        return reject(e);
      }

      let filenames = [];
      if (!req.body.employee_id) {
        const e = {
          message: "Employee_id wajib diisi",
          code: 422,
        };
        return reject(e);
      }

      const dataEmployee = await userRepository.acquireById(
        req.body.employee_id
      );

      if (!dataEmployee) {
        const e = {
          message: "employee_id reference not found",
          code: 422,
        };
        return reject(e);
      }

      let dataPositionMain = JSON.parse(JSON.stringify(dataEmployee.position));
      dataPositionMain = dataPositionMain.filter((obj) => {
        return obj.is_main == true;
      });
      const username =
        dataEmployee.is_pusat == true
          ? dataPositionMain[0].npp
          : `${dataPositionMain[0].company_code}${dataPositionMain[0].npp}`;

      if (req.files.profile) {
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/EmployeeFile/Profile/${username}${path.extname(
            req.files.profile[0].originalname
          )}`,
          req.files.profile[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "Profile",
          filename: `${username}${path.extname(
            req.files.profile[0].originalname
          )}`,
        });
      }

      if (req.files.attachment_ktp) {
        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/Employee/${fileName}${path.extname(
            req.files.attachment_ktp[0].originalname
          )}`,
          req.files.attachment_ktp[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "attachment_ktp",
          filename: `Employee/${fileName}${path.extname(
            req.files.attachment_ktp[0].originalname
          )}`,
        });
      }

      if (req.files.attachment_kk) {
        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/Employee/${fileName}${path.extname(
            req.files.attachment_kk[0].originalname
          )}`,
          req.files.attachment_kk[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "attachment_kk",
          filename: `Employee/${fileName}${path.extname(
            req.files.attachment_kk[0].originalname
          )}`,
        });
      }

      if (req.files.attachment_npwp) {
        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/Employee/${fileName}${path.extname(
            req.files.attachment_npwp[0].originalname
          )}`,
          req.files.attachment_npwp[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "attachment_npwp",
          filename: `Employee/${fileName}${path.extname(
            req.files.attachment_npwp[0].originalname
          )}`,
        });
      }

      if (req.files.attachment_bpjs_kes) {
        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/Employee/${fileName}${path.extname(
            req.files.attachment_bpjs_kes[0].originalname
          )}`,
          req.files.attachment_bpjs_kes[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "attachment_bpjs_kes",
          filename: `Employee/${fileName}${path.extname(
            req.files.attachment_bpjs_kes[0].originalname
          )}`,
        });
      }

      if (req.files.attachment_bpjs_ket) {
        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/Employee/${fileName}${path.extname(
            req.files.attachment_bpjs_ket[0].originalname
          )}`,
          req.files.attachment_bpjs_ket[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "attachment_bpjs_ket",
          filename: `Employee/${fileName}${path.extname(
            req.files.attachment_bpjs_ket[0].originalname
          )}`,
        });
      }

      if (req.files.attachment_buku_nikah) {
        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/Employee/${fileName}${path.extname(
            req.files.attachment_buku_nikah[0].originalname
          )}`,
          req.files.attachment_buku_nikah[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "attachment_buku_nikah",
          filename: `Employee/${fileName}${path.extname(
            req.files.attachment_buku_nikah[0].originalname
          )}`,
        });
      }

      if (req.files.attachment_dana_pensiun) {
        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/Employee/${fileName}${path.extname(
            req.files.attachment_dana_pensiun[0].originalname
          )}`,
          req.files.attachment_dana_pensiun[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "attachment_dana_pensiun",
          filename: `Employee/${fileName}${path.extname(
            req.files.attachment_dana_pensiun[0].originalname
          )}`,
        });
      }

      if (req.files.file_sk) {
        if (!req.body.position_id) {
          const e = {
            message: "position_id wajib diisi",
            code: 422,
          };
          return reject(e);
        }

        const searchPosition = await masterPositionRepository.acquireById(
          req.body.position_id
        );

        if (!searchPosition) {
          const e = {
            message: "position_id tidak ditemukan",
            code: 404,
          };
          return reject(e);
        }

        const searchEmpPosition =
          await employeePositionRepository.acquireByEmployeeIdAndPositionId(
            req.body.employee_id,
            req.body.position_id
          );

        if (!searchEmpPosition) {
          const e = {
            message: "position and employee that synced not found",
            code: 404,
          };
          return reject(e);
        }

        const fileName = crypto.randomBytes(64).toString("hex");
        minioClient.putObject(
          process.env.MINIO_BUCKET,
          `/file_sk/${fileName}${path.extname(
            req.files.file_sk[0].originalname
          )}`,
          req.files.file_sk[0].buffer,
          function (error, etag) {
            if (error) {
              console.log(error);
              const e = {
                message: error,
                code: 500,
              };
              return reject(e);
            }
          }
        );
        filenames.push({
          name: "file_sk",
          filename: `file_sk/${fileName}${path.extname(
            req.files.file_sk[0].originalname
          )}`,
        });
      }

      resolve(filenames);
    });
  });
}

async function writeFile(data, req = null, folderName) {
  let coreFileName = moment().add(-1, "days").format("YYYY-MM-DD") + `.json`;
  if (req !== null && req.query.changedate && req.query.personnel_number) {
    coreFileName =
      moment(req.query.changedate).format("YYYY-MM-DD") +
      `-${req.query.personnel_number}` +
      `.json`;
  } else if (
    req !== null &&
    req.query.changedate &&
    !req.query.personnel_number
  ) {
    coreFileName = moment(req.query.changedate).format("YYYY-MM-DD") + `.json`;
  }
  fs.writeFile(
    join("public", "jsondata", folderName, coreFileName),
    data,
    (err) => {
      if (err) throw err;
    }
  );
  return true;
}

async function uploadFile(req, res, folderName) {
  let coreFileName = moment().add(-1, "days").format("YYYY-MM-DD") + `.json`;
  if (req.query.changedate && req.query.personnel_number) {
    coreFileName =
      moment(req.query.changedate).format("YYYY-MM-DD") +
      `-${req.query.personnel_number}` +
      `.json`;
  } else if (req.query.changedate && !req.query.personnel_number) {
    coreFileName = moment(req.query.changedate).format("YYYY-MM-DD") + `.json`;
  }
  let path = join("public", "jsondata", folderName, coreFileName);

  let str = fs.createReadStream(path, "utf8");
  upload(req, res, (error) => {
    if (error) {
      console.log(error);
      throw new Error(
        `Something went wrong when uploading to Minio : ${error}`
      );
    }
    minioClient.putObject(
      process.env.MINIO_BUCKET,
      folderName + "/" + coreFileName,
      str,
      (error, etag) => {
        if (error) {
          console.log(error);
          throw new Error(
            `Something went wrong when uploading to Minio : ${error}`
          );
        }
        fs.unlink(path.replaceAll("\\", "/"), (error) => {
          if (error) {
            console.log(error);
            throw new Error(
              `Something went wrong when Deleting File in Local Storage : ${error}`
            );
          }
        });
      }
    );
  });
  return true;
}

const downloadFile = async (req, res) => {
  const filename = req.query.filename;
  const fileStream = await minioClient.getObject(
    process.env.MINIO_BUCKET,
    filename
  );

  fileStream.on("error", (err) => {
    return res.status(404).send(sendResponse.dataNotFoundException());
  });

  fileStream.on("data", (chunk) => {
    res.write(chunk);
  });

  fileStream.on("end", () => {
    res.end();
  });
};

const getTemplate = (req, res) => {
  const fileName = "Template Update Massal MAP New.xlsx";
  res.attachment(fileName);
  minioClient.getObject(
    process.env.MINIO_BUCKET,
    "/template_MAP/Template_Update_Massal_MAP_New.xlsx",
    (err, objStream) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      objStream.pipe(res);
    }
  );
};

async function previewFile(req, res) {
  let data;
  minioClient.getObject(
    process.env.MINIO_BUCKET,
    req.query.filename,
    function (err, objStream) {
      if (err) {
        return res.status(404).send(sendResponse.dataNotFoundException());
      }
      objStream.on("data", function (chunk) {
        data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
      });
      objStream.on("end", function () {
        res.writeHead(200, { "Content-Type": "image/jpg" });
        res.write(data);
        res.end();
      });
      objStream.on("error", function (err) {
        res.status(500);
        res.send(err);
      });
    }
  );
}

async function download(req, res) {
  try {
    let miniData;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    minioClient.getObject(
      process.env.MINIO_BUCKET,
      req.query.filename,
      function (error, stream) {
        if (error) {
          console.log(error);
          return res.status(404).send(sendResponse.dataNotFoundException());
        }
        stream.on("data", function (chunk) {
          miniData += chunk;
        });
        stream.on("end", function (chunk) {
          const response = miniData.replace("undefined", "");
          return res.status(200).send(JSON.parse(response));
        });
        stream.on("error", function (e) {
          console.log(e);
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function remove(filename) {
  minioClient.removeObject(process.env.MINIO_BUCKET, filename, function (err) {
    if (err) {
      return console.log("Unable to remove object", err);
    }
  });
}

module.exports = {
  uploadAttachment,
  uploadFile,
  download,
  uploadToDisk,
  upload,
  writeFile,
  remove,
  previewFile,
  downloadFile,
  streamFormJmClickUpdateMobility,
  getTemplate,
  streamFormJmClickUpdateFamily,
};
