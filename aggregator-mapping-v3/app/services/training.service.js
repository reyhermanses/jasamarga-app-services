const repository = require("../repositories/training.repository");
const xlsxPopulate = require('xlsx-populate');

async function getAllData(req) {
  let filter = {};
  let response = {};

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0;
  } else {
    filter.limit = 20;
  }

  if (req.query.page) {
    filter.offset =
      req.query.page && req.query.page != 1
        ? (req.query.page - 1) * filter.limit
        : 0;
  }

  const data = await repository.acquireAllData(
    filter,
    req.query.employee_id,
    req.query.pelatihan,
    req.query.tahun,
  );
  // console.log(data.rows[0].dataValues);

  if (req.query.employee_id || req.query.pelatihan || req.query.tahun) {
    const queryPositionName = req.query.position;
    const queryGrade = req.query.grade;
    const queryUnit = req.query.unit;

    const filteredData = data.rows.filter(row => {
      const position = row.dataValues.employee_training.position[0].dataValues;
      return (
        (!queryUnit || position.unit_id.toString() === queryUnit) &&
        (!queryPositionName || position.position_name.toLowerCase() === queryPositionName.toLowerCase()) &&
        (!queryGrade || position.grade === queryGrade)
      );
    });
    // console.log(filteredData);

    response = {
      count: filteredData.length,
      rows: filteredData
    };
  } else {
    response = {
      count: data.count,
      rows: data.rows
    };
  }

  return {
    total_pages: Math.ceil(data.count / filter.limit),
    current_page: req.query.page || 1,
    ...response,
  };
}

async function createData(data) {
  return await repository.generate(data);
}

async function getOneByIdData(id) {
  return await repository.acquireById(id);
}

async function updateData(id, data) {
  return await repository.modernize(id, data);
}

async function destroyData(id) {
  return await repository.remove(id);
}

async function getExcelHistoryData(req, res) {
  let filter = {};
  let response;

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0;

    if (req.query.page) {
      filter.offset =
        req.query.page && req.query.page != 1
          ? (req.query.page - 1) * filter.limit
          : 0;
    }
  }



  const data = await repository.acquireAllData(filter,
    req.query.employee_id,
    req.query.pelatihan,
    req.query.tahun
  );


  if (req.query.employee_id || req.query.pelatihan || req.query.tahun) {
    const queryPositionName = req.query.position;
    const queryGrade = req.query.grade;
    const queryUnit = req.query.unit;

    const filteredData = data.rows.filter(row => {
      const position = row.dataValues.employee_training.position[0].dataValues;
      return (
        (!queryUnit || position.unit_id.toString() === queryUnit) &&
        (!queryPositionName || position.position_name.toLowerCase() === queryPositionName.toLowerCase()) &&
        (!queryGrade || position.grade === queryGrade)
      );
    });
    // console.log(filteredData);
    response = filteredData
  } else {
    response = data.rows
  };


  return new Promise(async (resolve, reject) => {
    try {
      const workbook = await xlsxPopulate.fromBlankAsync();
      const sheet = workbook.addSheet('History Training');
      workbook.deleteSheet('Sheet1');

      // Menambahkan header
      sheet.cell('A1').value('Employee ID');
      sheet.cell('B1').value('Employee Name');
      sheet.cell('C1').value('NPP');
      sheet.cell('D1').value('Training Year');
      sheet.cell('E1').value('Training Name');
      sheet.cell('F1').value('Execution');
      sheet.cell('G1').value('Start Date');
      sheet.cell('H1').value('End Date');
      sheet.cell('I1').value('Place');
      sheet.cell('J1').value('City');
      sheet.cell('K1').value('Initiator');
      sheet.cell('L1').value('Assignment Number');
      sheet.cell('M1').value('Training Group 1');
      sheet.cell('N1').value('Training Group 2');
      sheet.cell('O1').value('Country');
      sheet.cell('P1').value('Certificate Number');
      sheet.cell('Q1').value('Score');
      sheet.cell('R1').value('Rank');
      sheet.cell('S1').value('Cost');
      // sheet.cell('S1').value('Position Name');
      // sheet.cell('T1').value('Is Main');
      // sheet.cell('S1').value('Employee NPP');
      // sheet.cell('V1').value('Employee KD Comp');
      // sheet.cell('W1').value('Unit Kerja');
      // sheet.cell('X1').value('Unit ID');
      // sheet.cell('Y1').value('Grade');
      // sheet.cell('Z1').value('Position ID');

      const headerRange = sheet.range('A1:S1');

      // Mengatur warna latar belakang untuk sel header
      headerRange.style({
        fill: {
          type: 'solid',
          color: 'feb409'
        },
        bold: true,
        border: {
          top: true,
          left: true,
          bottom: true,
          right: true
        }
      });
      sheet.column('A').width(15);
      sheet.column('B').width(40);
      sheet.column('C').width(10);
      sheet.column('D').width(15);
      sheet.column('E').width(80);
      sheet.column('F').width(40);
      sheet.column('G').width(12);
      sheet.column('H').width(12);
      sheet.column('I').width(30);
      sheet.column('J').width(15);
      sheet.column('K').width(40);
      sheet.column('L').width(40);
      sheet.column('M').width(25);
      sheet.column('N').width(30);
      sheet.column('O').width(25);
      sheet.column('P').width(30);
      sheet.column('Q').width(10);
      sheet.column('R').width(10);
      sheet.column('S').width(10);
      // sheet.column('T').width(20);
      // sheet.column('U').width(20);
      // sheet.column('V').width(20);
      // sheet.column('W').width(20);
      // sheet.column('X').width(20);
      // sheet.column('Y').width(20);
      // sheet.column('Z').width(20);

      // // Menambahkan data dari database
      response.forEach((item, index) => {
        const row = index + 2;
        sheet.cell(`A${row}`).value(item.dataValues.employee_id);
        sheet.cell(`B${row}`).value(item.dataValues.employee_training.dataValues.employee_name);
        if (item.dataValues && item.dataValues.employee_training && item.dataValues.employee_training.dataValues && item.dataValues.employee_training.dataValues.position && item.dataValues.employee_training.dataValues.position[0] && item.dataValues.employee_training.dataValues.position[0].dataValues && item.dataValues.employee_training.dataValues.position[0].dataValues.employee_npp) {
          sheet.cell(`C${row}`).value(item.dataValues.employee_training.dataValues.position[0].dataValues.employee_npp);
        }
        sheet.cell(`D${row}`).value(item.dataValues.tahun);
        sheet.cell(`E${row}`).value(item.dataValues.pelatihan);
        sheet.cell(`F${row}`).value(item.dataValues.pelaksanaan);
        sheet.cell(`G${row}`).value(new Date(item.dataValues.tgl_awal).toLocaleDateString());
        sheet.cell(`H${row}`).value(new Date(item.dataValues.tgl_akhir).toLocaleDateString());
        sheet.cell(`I${row}`).value(item.dataValues.tempat);
        sheet.cell(`J${row}`).value(item.dataValues.kota);
        sheet.cell(`K${row}`).value(item.dataValues.inisiator);
        sheet.cell(`L${row}`).value(item.dataValues.no_penugasan);
        sheet.cell(`M${row}`).value(item.dataValues.klp_plth1);
        sheet.cell(`N${row}`).value(item.dataValues.klp_plth2);
        sheet.cell(`O${row}`).value(item.dataValues.negara);
        sheet.cell(`P${row}`).value(item.dataValues.nosertifikat);
        sheet.cell(`Q${row}`).value(item.dataValues.nilai);
        sheet.cell(`R${row}`).value(item.dataValues.peringkat);
        sheet.cell(`S${row}`).value(item.dataValues.biaya);
        // sheet.cell(`S${row}`).value(item.employee_training.position[0].position_name);
        // sheet.cell(`T${row}`).value(item.employee_training.position[0].is_main);
        // sheet.cell(`V${row}`).value(item.employee_training.position[0].employee_kd_comp);
        // sheet.cell(`W${row}`).value(item.employee_training.position[0].unit_kerja);
        // sheet.cell(`X${row}`).value(item.employee_training.position[0].unit_id);
        // sheet.cell(`Y${row}`).value(item.employee_training.position[0].grade);
        // sheet.cell(`Z${row}`).value(item.employee_training.position[0].position_id);;
        // sheet.cell(`J${row}`).value(item.employee_training.position.position_id);
      });

      const buffer = await workbook.outputAsync();
      resolve(buffer);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

module.exports = {
  getAllData,
  createData,
  getOneByIdData,
  updateData,
  destroyData,
  getExcelHistoryData
};
