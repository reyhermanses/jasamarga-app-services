const repository = require('../repositories/template.repository')
const minioClient = require("../../config/minio");

const XLSX = require('xlsx-color');
const xlsxPopulate = require('xlsx-populate');
require('dotenv').config()

const dataEmployeeGroup = async (workbook) => {
  const worksheet = workbook.sheet(2);
  const data = await repository.acquireEmployeeGroup()

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['EMPLOYEE GROUP ID'])
    worksheet.cell(`B${index + 2}`).value(data['EMPLOYEE GROUP'])
  });
}

const dataCompanies = async (workbook, companiesId, page) => {
  const worksheet = workbook.sheet(page);
  const data = await repository.acquireCompanies(companiesId)

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['KD_COMP ID'])
    worksheet.cell(`B${index + 2}`).value(data['NAMA COMPANY'])
    worksheet.cell(`C${index + 2}`).value(data['KD_COMP'])
    worksheet.cell(`D${index + 2}`).value(data['NAMA SINGKATAN'])
  });
}

const dataOrganisasi = async (workbook) => {
  const worksheet = workbook.sheet(3);
  const data = await repository.acquireOrganisasi()

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['ORGANISASI ID'])
    worksheet.cell(`B${index + 2}`).value(data['NAMA ORGANISASI'])
    worksheet.cell(`C${index + 2}`).value(data['PARENT ORGANISASI ID'])
    worksheet.cell(`D${index + 2}`).value(data['NAMA PARENT'])
  })
}

const dataJob = async (workbook) => {
  const worksheet = workbook.sheet(4);
  const data = await repository.acquireJob()

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['id'])
    worksheet.cell(`B${index + 2}`).value(data['name'])
  })
}

const dataFungsiJabatan = async (workbook) => {
  const worksheet = workbook.sheet(5);
  const data = await repository.acquireFungsiJabatan()

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['id'])
    worksheet.cell(`B${index + 2}`).value(data['subgroup'])
  })
}

const dataCluster = async (workbook) => {
  const worksheet = workbook.sheet(6);
  const data = await repository.acquireCluster()

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['id'])
    worksheet.cell(`B${index + 2}`).value(data['kode'])
    worksheet.cell(`C${index + 2}`).value(data['name'])
  })
}

const dataSubCluster = async (workbook) => {
  const worksheet = workbook.sheet(7);
  const data = await repository.acquireSubCluster()

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['id'])
    worksheet.cell(`B${index + 2}`).value(data['cluster_id'])
    worksheet.cell(`C${index + 2}`).value(data['name'])
    worksheet.cell(`D${index + 2}`).value(data['kode'])
    worksheet.cell(`E${index + 2}`).value(data['fungsi'])
  })
}

const dataReligion = async (workbook) => {
  const worksheet = workbook.sheet(4);
  const data = await repository.acquireReligion();

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['AGAMA ID'])
    worksheet.cell(`B${index + 2}`).value(data['AGAMA'])
  });
}

const dataMasterStatusKeluarga = async (workbook) => {
  const worksheet = workbook.sheet(5);
  const data = await repository.acquireMasterKeluarga();

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['STATUS KELUARGA ID'])
    worksheet.cell(`B${index + 2}`).value(data['STATUS KELUARGA'])
  });
}

const dataProvincies = async (workbook) => {
  const worksheet = workbook.sheet(6);
  const data = await repository.acquireMasterProvince();

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['PROVINSI ID'])
    worksheet.cell(`B${index + 2}`).value(data['PROVINSI'])
  });
}

const dataCities = async (workbook) => {
  const worksheet = workbook.sheet(7);
  const data = await repository.acquireMasterCity();

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['KOTA ID'])
    worksheet.cell(`B${index + 2}`).value(data['PROVINSI'])
    worksheet.cell(`C${index + 2}`).value(data['KOTA / KABUPATEN'])
  });
}

const dataKecamatan = async (workbook) => {
  const worksheet = workbook.sheet(8);
  const data = await repository.acquireMasterKecamatan();

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['KECAMATAN ID'])
    worksheet.cell(`B${index + 2}`).value(data['KOTA / KABUPATEN'])
    worksheet.cell(`C${index + 2}`).value(data['KECAMATAN'])
  });
}

const dataKelurahan = async (workbook) => {
  const worksheet = workbook.sheet(9);
  const data = await repository.acquireMasterKelurahan();
  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['KELURAHAN ID'])
    worksheet.cell(`B${index + 2}`).value(data['KECAMATAN'])
    worksheet.cell(`C${index + 2}`).value(data['KELURAHAN'])
  });
}

const dataInstansiPendidikan = async (workbook) => {
  const worksheet = workbook.sheet(10);
  const data = await repository.acquireInstansiPendidikan();
  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['INSTANSI ID'])
    worksheet.cell(`B${index + 2}`).value(data['INSTANSI PENDIDIKAN'])
  });
}

const dataJenjangPendidikan = async (workbook) => {
  const worksheet = workbook.sheet(11);
  const data = await repository.acquireJenjangPendidikan();
  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['JENJANG PENDIDIKAN ID'])
    worksheet.cell(`B${index + 2}`).value(data['JENJANG PENDIDIKAN'])
  });
}

const dataJurusanPendidikan = async (workbook) => {
  const worksheet = workbook.sheet(12);
  const data = await repository.acquireJurusanPendidikan();
  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['JURUSAN ID'])
    worksheet.cell(`B${index + 2}`).value(data['JURUSAN PENDIDIKAN'])
  });
}

const dataFakultasPendidikan = async (workbook) => {
  const worksheet = workbook.sheet(13);
  const data = await repository.acquireFakultasPendidikan();
  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['FAKULTAS ID'])
    worksheet.cell(`B${index + 2}`).value(data['FAKULTAS PENDIDIKAN'])
  });
}

const dataGelarPendidikan = async (workbook) => {
  const worksheet = workbook.sheet(14);
  const data = await repository.acquireGelarPendidikan();
  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['GELAR ID'])
    worksheet.cell(`B${index + 2}`).value(data['GELAR PENDIDIKAN'])
    worksheet.cell(`C${index + 2}`).value(data['TIPE'])
    worksheet.cell(`D${index + 2}`).value(data['SINGKATAN GELAR'])
  });
}

const dataPositions = async (workbook, companiesId) => {
  const worksheet = workbook.sheet(3);
  const data = JSON.parse(JSON.stringify(await repository.acquirePositions(companiesId)))

  data.forEach((data, index) => {
    worksheet.cell(`A${index + 2}`).value(data['JABATAN ID'])
    worksheet.cell(`B${index + 2}`).value(data['NAMA JABATAN'])
    worksheet.cell(`C${index + 2}`).value(data['KD_COMP'])
    worksheet.cell(`D${index + 2}`).value(data['UNIT KERJA'])
    worksheet.cell(`E${index + 2}`).value(data['DIREKTORAT'])
    worksheet.cell(`F${index + 2}`).value(data['DEPARTEMEN'])
    worksheet.cell(`G${index + 2}`).value(data['SEKSI'])
    worksheet.cell(`H${index + 2}`).value(data['JOB'])
    worksheet.cell(`I${index + 2}`).value(data['GRADE'])
    worksheet.cell(`J${index + 2}`).value(data['LEVEL'])
    worksheet.cell(`K${index + 2}`).value(data['CLUSTER'])
    worksheet.cell(`L${index + 2}`).value(data['SUB CLUSTER'])
    worksheet.cell(`M${index + 2}`).value(data['KELOMPOK JABATAN'])
  });
}

const getMasterData = async (req) => {
  return new Promise((resolve, reject) => {
    minioClient.getObject(
      process.env.MINIO_BUCKET,
      '/template_MAP/MASTER_DATA.xlsx',
      (err, dataStream) => {
        if (err) {
          console.error(err);
          reject(err)
        }

        const buffers = [];
        dataStream.on('data', (chunk) => buffers.push(chunk));
        dataStream.on('end', async () => {
          const buffer = Buffer.concat(buffers);
          const workbook = await xlsxPopulate.fromDataAsync(buffer);

          await dataCompanies(workbook, req.body.company_id ? req.body.company_id : null, 1)
          await dataEmployeeGroup(workbook)
          await dataPositions(workbook, req.body.company_id ? req.body.company_id : null)
          await dataReligion(workbook)
          await dataMasterStatusKeluarga(workbook)
          await dataProvincies(workbook)
          await dataCities(workbook)
          await dataKecamatan(workbook)
          // await dataKelurahan(workbook)
          await dataInstansiPendidikan(workbook)
          await dataJenjangPendidikan(workbook)
          await dataJurusanPendidikan(workbook)
          await dataFakultasPendidikan(workbook)
          await dataGelarPendidikan(workbook)

          const updatedBuffer = await workbook.outputAsync();
          const modifiedTemplateBuffer = updatedBuffer;
          resolve(modifiedTemplateBuffer)
        });
      });
  })
}

const getMasterPositionData = async (req) => {
  return new Promise((resolve, reject) => {
    minioClient.getObject(
      process.env.MINIO_BUCKET,
      '/template_MAP/Template_Massal_Jabatan.xlsx',
      (err, dataStream) => {
        if (err) {
          console.error(err);
          reject(err)
        }

        const buffers = [];
        dataStream.on('data', (chunk) => buffers.push(chunk));
        dataStream.on('end', async () => {
          const buffer = Buffer.concat(buffers);
          const workbook = await xlsxPopulate.fromDataAsync(buffer);

          await dataCompanies(workbook, req.body.company_id ? req.body.company_id : null, 2)
          await dataOrganisasi(workbook)
          await dataJob(workbook)
          await dataFungsiJabatan(workbook)
          await dataCluster(workbook)
          await dataSubCluster(workbook)

          const updatedBuffer = await workbook.outputAsync();
          const modifiedTemplateBuffer = updatedBuffer;
          resolve(modifiedTemplateBuffer)
        });
      });
  })
}

module.exports = {
  getMasterData,
  getMasterPositionData
}