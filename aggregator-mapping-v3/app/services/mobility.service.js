const repository = require("../repositories/mobility.repository");
const minioClient = require("../../config/minio");
const masterPositionRepository = require("../repositories/master/masterPosition.repository");
const historyJabatanRepository = require("../repositories/historyJabatan.repository");
const organizationRepository = require("../repositories/organizationHierarchy.repository")

const moment = require("moment");
const path = require("path");
const crypto = require("crypto");

const generateRangkapData = async (data, username, transaction) => {
  let dataPosition = await repository.acquireEmployeePosition(data.employee_id);

  // update data master position
  await repository.modernizeMasterPosition(
    data.position_id,
    {
      sk_position_no: data.no_sk,
      sk_position_date: data.tanggal_sk,
      start_date: data.start_date,
      end_date: null,
    },
    transaction
  );

  // get the latest position
  const newPosition = await repository.acquireByIdMasterPosition(
    data.position_id
  );
  if (newPosition) {
    // get the latest leader
    const leader = await repository.acquireLeader(newPosition.org_id);

    let atasanId = leader.leader_id;
    let atasanPositionId = leader.leader_position_id;

    if (leader.leader_position_id == data.position_id) {
      atasanId = leader.parent?.leader_id;
      atasanPositionId = leader.parent?.leader_position_id;

      leader.leader_id = data.employee_id
      await leader.save({ transaction });
    }

    // get the latest main position
    const lastPosition = await repository.acquireMainPosition(data.employee_id);
    // generate new employee_position
    await repository.generateEmployeePosition(
      {
        employee_id: data.employee_id,
        npp: lastPosition.npp,
        personnel_number: lastPosition.personnel_number,
        position_id: data.position_id,
        atasan_id: atasanId,
        atasan_position_id: atasanPositionId,
        action: "rangkap",
        is_main: false,
        created_by: username,
      },
      transaction
    );
  }

  const currentDataMasterPosition = await masterPositionRepository.acquireById(
    data.position_id
  );
  const checkJobAvailability =
    await masterPositionRepository.checkJobAvailabilityForMobility(
      currentDataMasterPosition.job_id,
      currentDataMasterPosition.org_id
    );

  if (!checkJobAvailability) {
    const error = new Error("Formasi Penuh");
    error.statusCode = 422;
    throw error;
  }

  const dataFormation = await masterPositionRepository.acquireJobFormation(
    currentDataMasterPosition.job_id,
    currentDataMasterPosition.org_id
  );

  if (dataFormation && dataFormation.unprocess > 0) {
    dataFormation.unprocess--;
    await dataFormation.save();
  }

  return dataPosition;
};

const generatePensiunTerminateData = async (
  data,
  username,
  mode,
  transaction
) => {
  let dataPosition = await repository.acquireEmployeePosition(data.employee_id);

  const dateMoment = moment(data.end_date, "YYYY-MM-DD");
  const previousDayMoment = dateMoment.subtract(1, "day");
  const previousDayString = previousDayMoment.format("YYYY-MM-DD");

  const awalPosisi = dataPosition[0].awal_posisi
  const tanggalSkPosisi = dataPosition[0].sk_position_date

  // generate akhir posisi per-hari ini dan history jabatan
  dataPosition = dataPosition.map((obj) => {
    obj.awal_posisi = data.end_date;
    obj.created_by = username;
    obj.last_sk_posisi = obj.sk_posisi;
    obj.sk_posisi = data.no_sk;
    obj.sk_position_date = data.tanggal_sk;
    obj.last_action = obj.action;
    obj.action = mode;
    obj.info = data.jenis;
    return obj;
  });

  // check whether the employee got no history jabatan
  const checkHistoryJabatan = await repository.acquireHistoryJabatan(
    data.employee_id
  );

  let addedHistory = {
    ...dataPosition[0],
    info: null,
  };

  // if the employee got no history, then create 2 history jabatan
  if (!checkHistoryJabatan) {
    addedHistory.action = 'initial data'
  } else {
    addedHistory.action = dataPosition[0].last_action
  }

  addedHistory.sk_posisi = dataPosition[0].last_sk_posisi
  addedHistory.awal_posisi = awalPosisi
  addedHistory.akhir_posisi = previousDayString
  addedHistory.sk_position_date = tanggalSkPosisi

  dataPosition.push(addedHistory);

  // generate history jabatan
  await repository.generateHistoryJabatan(dataPosition, transaction);

  // delete all last position
  await repository.removeEmployeePosition(data.employee_id, transaction);

  // set employee status to false
  await repository.deactivateEmpStatus(data.employee_id, transaction);

  // if the employee is a leader, delete the leader sign in organization_hieararchy
  await organizationRepository.deleteLeader(data.employee_id, transaction)

  return dataPosition;
};

const generatePromosiRotasiDemosiData = async (
  data,
  username,
  mode,
  transaction
) => {
  let dataPosition = await repository.acquireEmployeePosition(data.employee_id);

  const dateMoment = moment(data.start_date, "YYYY-MM-DD");
  const previousDayMoment = dateMoment.subtract(1, "day");
  const previousDayString = previousDayMoment.format("YYYY-MM-DD");

  // generate akhir posisi per-hari ini dan history jabatan
  dataPosition = dataPosition.map((obj) => {
    obj.akhir_posisi = previousDayString;
    obj.created_by = username;
    return obj;
  });
  await repository.generateHistoryJabatan(dataPosition, transaction);

  // delete the position before
  // for (const obj of dataPosition) {
  //   await repository.removeMasterPosition(obj.posisi_id, transaction)
  // }

  // update data master position
  await repository.modernizeMasterPosition(
    data.position_id,
    {
      sk_position_no: data.no_sk,
      sk_position_date: data.tanggal_sk,
      start_date: data.start_date,
      end_date: null,
    },
    transaction
  );

  const currentDataMasterPosition = await masterPositionRepository.acquireById(
    data.position_id
  );

  await repository.modernizeEmployeeSubGroup(data.employee_id, transaction, currentDataMasterPosition.fungsi_jabatan)

  const currentEmployeeData = await repository.acquireEmployeeCompanyAsalByID(data.employee_id);

  if (currentDataMasterPosition.company_id !== currentEmployeeData.company_id_asal) {
    currentEmployeeData.company_id_penugasan = currentDataMasterPosition.company_id
    currentEmployeeData.is_penugasan = true
  } else {
    currentEmployeeData.company_id_penugasan = null
    currentEmployeeData.is_penugasan = false
  }
  currentEmployeeData.updated_by = 'JM_CLICK'
  await currentEmployeeData.save({ transaction })

  const checkJobAvailability =
    await masterPositionRepository.checkJobAvailabilityForMobility(
      currentDataMasterPosition.job_id,
      currentDataMasterPosition.org_id
    );

  if (!checkJobAvailability) {
    const error = new Error("Formasi Penuh");
    error.statusCode = 422;
    throw error;
  }

  const dataFormation = await masterPositionRepository.acquireJobFormation(
    currentDataMasterPosition.job_id,
    currentDataMasterPosition.org_id
  );

  if (dataFormation && dataFormation.unprocess > 0) {
    dataFormation.unprocess--;
    await dataFormation.save({ transaction });
  }

  // get the latest position
  const newPosition = await repository.acquireByIdMasterPosition(
    data.position_id
  );
  if (newPosition) {
    // get the latest leader
    const leader = await repository.acquireLeader(newPosition.org_id);

    let atasanId = leader.leader_id;
    let atasanPositionId = leader.leader_position_id;

    if (leader.leader_position_id == data.position_id) {
      atasanId = leader.parent?.leader_id;
      atasanPositionId = leader.parent?.leader_position_id;
      leader.leader_id = data.employee_id
    }

    if (leader.leader_position_id !== data.position_id && data.employee_id == leader.leader_id) {
      leader.leader_id = null
    }
    await leader.save({ transaction });

    // get the latest main position
    const lastPosition = await repository.acquireMainPosition(data.employee_id);

    // delete all last employee_position
    await repository.removeEmployeePosition(data.employee_id, transaction);

    // generate new employee_position
    await repository.generateEmployeePosition(
      {
        employee_id: data.employee_id,
        npp: lastPosition.npp,
        personnel_number: lastPosition.personnel_number,
        position_id: data.position_id,
        atasan_id: atasanId,
        atasan_position_id: atasanPositionId,
        action: mode,
        is_main: true,
        created_by: username,
      },
      transaction
    );
  }

  return dataPosition;
};

const updateHistoryJabatanJmClickData = async (req) => {
  const { tipe, info, no_sk, tanggal_sk, start_date, end_date, jabatan_id } =
    req.body;

  let updateBody = {
    updated_by: req.api_key.name,
  };

  if (tipe) {
    updateBody.action = tipe;
  }

  if (info) {
    updateBody.info = info;
  }

  if (no_sk) {
    updateBody.sk_posisi = no_sk;
  }

  if (tanggal_sk) {
    updateBody.sk_position_date = tanggal_sk;
  }

  if (start_date) {
    updateBody.awal_posisi = start_date;
  }

  if (end_date) {
    updateBody.akhir_posisi = end_date;
  }

  if (jabatan_id) {
    const { name } = await masterPositionRepository.acquireById(jabatan_id);
    updateBody.posisi = name;
  }

  if (req.files.file_sk) {
    if (req.files.file_sk[0].mimetype !== "application/pdf") {
      const error = new Error("Only PDF files are allowed");
      error.statusCode = 422;
      throw error;
    }

    const fileName = crypto.randomBytes(64).toString("hex");
    minioClient.putObject(
      process.env.MINIO_BUCKET,
      `/file_sk/${fileName}${path.extname(req.files.file_sk[0].originalname)}`,
      req.files.file_sk[0].buffer,
      function (error, etag) {
        if (error) {
          throw new Error(
            `Something went wrong when uploading to Minio : ${error}`
          );
        }
      }
    );
    updateBody.file_sk = `/file_sk/${fileName}${path.extname(
      req.files.file_sk[0].originalname
    )}`;
  }

  await historyJabatanRepository.modernize(req.params.id, updateBody);

  return updateBody;
};

module.exports = {
  generatePromosiRotasiDemosiData,
  generatePensiunTerminateData,
  generateRangkapData,
  updateHistoryJabatanJmClickData,
};
