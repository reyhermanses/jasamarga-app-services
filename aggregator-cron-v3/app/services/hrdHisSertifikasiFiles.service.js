const repository = require('../repositories/hrdHisSertifikasiFiles.repository');
const moment = require('moment');

const cron = require('node-cron');
const { Pool } = require('pg');

const sourcePool = new Pool({
  user: process.env.DB_USERNAME_JMCLICK,
  host: process.env.DB_HOST_JMCLICK,
  database: process.env.DB_NAME_JMCLICK,
  password: process.env.DB_PASSWORD_JMCLICK,
  port: process.env.DB_PORT_JMCLICK,
});

const getData = async (req) => {
    let mappingDataArray = []; // Define mappingDataArray outside the try block
    try {
      // Check source database connection
      const sourceClient = await sourcePool.connect();
      console.log('Source database connected successfully');
  
      // Get sertifikasi data from source database
      const sertifikasiFilesDataResponse = await repository.getSertifikasiFilesData(sourceClient, req.query.changedate ? req.query.changedate : null);
      
      // Transfer data process if sertifikasiDataResponse not null
      if(sertifikasiFilesDataResponse){
          // Clear mappingDataArray before starting new iteration
          mappingDataArray = [];
          for (const row of sertifikasiFilesDataResponse){
              // mapping data from source data so that appropriate destination data
              const newData = await repository.mappingData(row, mappingDataArray);
      
              // insert or update mapping data into destination database
              await repository.upsertRow(newData);
          }
      }

      // return the function
      if(sertifikasiFilesDataResponse) {
          return mappingDataArray;
      }
      else{
          return [];
      }
  
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      // Handle the error appropriately, such as returning an error response
      throw error;
    }
  };
  

module.exports = {
  getData
};
