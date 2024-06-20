const {
    HrdHisSertifikasiFiles,
  } = require("../../models");
  const { Op, QueryTypes } = require("sequelize");
  const moment = require("moment");
  
  async function upsertRow(data) {
    return await HrdHisSertifikasiFiles.findOne({
      where: {
        [Op.and]: [
          {
            hrd_his_sertifikasi_id: data.hrd_his_sertifikasi_id,
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
      return HrdHisSertifikasiFiles.create(data);
    });
  }

  const getSertifikasiFilesData = async (sourceClient, changeDate) => {
    let date;
    if (changeDate) {
        date = changeDate;
    } else {
        date = moment().add(-1, "days").format("YYYY-MM-DD");
    }
    
    // Transfer data from HRD_HIS_SERTIFIKASI table
    const querySertifikasiFiles = `
        SELECT *
        FROM "HRD_HIS_SERTIFIKASI_FILES"
        WHERE "CREATED_AT"::date = '${date}' OR "UPDATED_AT"::date = '${date}'
    `;
    const sertifikasiFilesResult = await sourceClient.query(querySertifikasiFiles);
    const sertifikasiFilesRows = sertifikasiFilesResult.rows;
    console.log('sertifikasiFilesRows: ', sertifikasiFilesRows.length);

    // return function getSertifikasiData
    if (sertifikasiFilesRows !== null && sertifikasiFilesRows.length > 0) {
        return sertifikasiFilesRows;
    } else {
        return [];
    }
    };  

    async function mappingData(row, mappingDataArray){
        // Creates a new object that matches the column structure of the destination database
        const newData = {
            id: row.ID, // Mapping ID dari database sumber ke kolom id di database tujuan
            UUID: row.UUID, // Mapping UUID dari database sumber ke kolom UUID di database tujuan
            hrd_his_sertifikasi_id: row.HRD_HIS_SERTIFIKASI_ID, // Mapping TAHUN dari database sumber ke kolom tahun di database tujuan
            url: row.URL, // Mapping NM_SERTIFIKASI dari database sumber ke kolom nm_sertifikasi di database tujuan
            updated_at: row.UPDATED_AT, // Mapping UPDATED_AT dari database sumber ke kolom updated_at di database tujuan
            created_at: row.CREATED_AT, // Mapping CREATED_AT dari database sumber ke kolom created_at di database tujuan
            file_name: row.NAMA, // Mapping FILE_NAME dari
        };

        // push new Data to mappingDataArray
        mappingDataArray.push(newData);

        // return function mappingData
        return newData;
    }
  
  module.exports = {
    upsertRow,
    getSertifikasiFilesData,
    mappingData
  };
  