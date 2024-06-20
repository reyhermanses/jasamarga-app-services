const {
    EmployeePosition,
    HistoryJabatan,
    HrdHisSertifikasi,
  } = require("../../models");
  const { Op, QueryTypes } = require("sequelize");
  const moment = require("moment");
  
  const acquireEmployeeIdByNPP = async (NPP) => {
    try {
        // get the employee_id from employee_position or history_jabatan
        const employeePosition = await EmployeePosition.findOne({
            where: {
                npp: NPP
            }
        });
        if (employeePosition) {
            return employeePosition.employee_id;
        } else {
            // Handle case when employee with given NPP is not found in employee_position then we search on history_jabatan
            const historyJabatan = await HistoryJabatan.findOne({
                where: {
                npp: NPP
                }
            });
            if (historyJabatan) {
                return historyJabatan.employee_id;
            }else{ // if employee with given NPP is not found in employee_position and history jabatan then null is returned
                return null;
            }
        }
    } catch (error) {
      console.error("Error occurred while acquiring employee ID by NPP:", error);
      throw error;
    }
  };

  async function upsertRow(data) {
    return await HrdHisSertifikasi.findOne({
      where: {
        [Op.and]: [
          {
            employee_id: data.employee_id,
          },
          {
            UUID: data.UUID,
          },
        ],
      },
    }).then((obj) => {
      if (obj) {
        // console.log("updated");
        data.updated_by = "aggregator-cron";
        return obj.update(data);
      }
    //   console.log("created");
      data.created_by = "aggregator-cron";
      return HrdHisSertifikasi.create(data);
    });
  }

  const getSertifikasiData = async (sourceClient, changeDate) => {
    let date;
    if (changeDate) {
        date = changeDate;
    } else {
        date = moment().add(-1, "days").format("YYYY-MM-DD");
    }
    
    // Transfer data from HRD_HIS_SERTIFIKASI table
    const querySertifikasi = `
        SELECT *
        FROM "HRD_HIS_SERTIFIKASI"
        WHERE "CREATED_AT"::date = '${date}' OR "UPDATED_AT"::date = '${date}'
    `;
    const sertifikasiResult = await sourceClient.query(querySertifikasi);
    const sertifikasiRows = sertifikasiResult.rows;
    // console.log(sertifikasiRows);
    console.log('sertifikasiRows: ', sertifikasiRows.length);

    // return function getSertifikasiData
    if (sertifikasiRows !== null && sertifikasiRows.length > 0) {
        return sertifikasiRows;
    } else {
        return [];
    }
    };  

    async function mappingData(row, mappingDataArray){
        // get employee_id from npp
        let emp_id = await acquireEmployeeIdByNPP(row.NPP);

        // Creates a new object that matches the column structure of the destination database
        const newData = {
            id: row.ID, // Mapping ID dari database sumber ke kolom id di database tujuan
            employee_id: emp_id, // Mapping NPP dari database sumber ke kolom employee_id di database tujuan
            UUID: row.UUID, // Mapping UUID dari database sumber ke kolom UUID di database tujuan
            tahun: row.TAHUN, // Mapping TAHUN dari database sumber ke kolom tahun di database tujuan
            nm_sertifikasi: row.NM_SERTIFIKASI, // Mapping NM_SERTIFIKASI dari database sumber ke kolom nm_sertifikasi di database tujuan
            nm_institusi: row.NM_INSTITUSI, // Mapping NM_INSTITUSI dari database sumber ke kolom nm_institusi di database tujuan
            tgl_ambil: row.TGL_AMBIL, // Mapping TGL_AMBIL dari database sumber ke kolom tgl_ambil di database tujuan
            tgl_habis_berlaku: row.TGL_HABIS_BERLAKU, // Mapping TGL_HABIS_BERLAKU dari database sumber ke kolom tgl_habis_berlaku di database tujuan
            tempat: row.TEMPAT, // Mapping TEMPAT dari database sumber ke kolom tempat di database tujuan
            updated_at: row.UPDATED_AT, // Mapping UPDATED_AT dari database sumber ke kolom updated_at di database tujuan
            created_at: row.CREATED_AT, // Mapping CREATED_AT dari database sumber ke kolom created_at di database tujuan
        };

        // push new Data to mappingDataArray
        mappingDataArray.push(newData);

        // return function mappingData
        return newData;
    }
  
  module.exports = {
    acquireEmployeeIdByNPP,
    upsertRow,
    getSertifikasiData,
    mappingData
  };
  