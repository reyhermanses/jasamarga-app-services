const repoEspt = require("../repositories/espt.repository");
const repoEmp = require("../repositories/omAction.repository");
const repoEmpProfile = require("../repositories/employee_profile.repository");
// const repoCompany = require("../repositories/master/masterCompany.repository");

require("dotenv").config();
let moment = require("moment");
const { Op } = require("sequelize");

async function serviceSap(query) {
  let startDate = query.date_now || Date.now();
  let dateNow = moment(startDate).format("YYYYMMDD");
  let responseEmployee = await repoEmp.acquireAllEmp();
  const resEmp = JSON.parse(JSON.stringify(responseEmployee));
  for (let i = 0; i < resEmp.length; i++) {

    let is_pensiun = false;
    let data = [];

    if (resEmp[i].employee_status) {
      is_pensiun = false;
      data = await repoEmp.acquireEmpPos(resEmp[i].id)
      // console.log('aktif')
    } else {
      data = await repoEmp.acquireEmpHistory(resEmp[i].id)
      // console.log('non aktif')
      if (data) {
        is_pensiun = true;
        if (data.npp && !data.personnel_number) {
          data.personnel_number = "000" + data.npp
        }
      }
    }


    if (data) {
      if (data.personnel_number) {

        let response = await repoEspt.acquiredSap(
          dateNow,
          data.personnel_number
        );

        // return response

        let res = JSON.parse(JSON.stringify(response.data));

        res.forEach(async (value) => {
          //status_ptk/jml_tanggungan
          const empProf = await repoEmpProfile.acquiredOne(resEmp[i].id);
          if (empProf) {
            empProf.status_npwp = `${value.status_ptkp}/${value.jml_tanggungan}`
            empProf.save();
          }
          value.employee_id = resEmp[i].id;
          value.masa_perolehan_awal = value.masa_perolehan_awal ? value.masa_perolehan_awal : 0;
          value.masa_perolehan_akhir = value.masa_perolehan_akhir ? value.masa_perolehan_akhir : 0;
          value.jumlah1 = value.jumlah1 ? value.jumlah1 : 0;
          value.jumlah2 = value.jumlah2 ? value.jumlah2 : 0;
          value.jumlah3 = value.jumlah3 ? value.jumlah3 : 0;
          value.jumlah4 = value.jumlah4 ? value.jumlah4 : 0;
          value.jumlah5 = value.jumlah5 ? value.jumlah5 : 0;
          value.jumlah6 = value.jumlah6 ? value.jumlah6 : 0;
          value.jumlah7 = value.jumlah7 ? value.jumlah7 : 0;
          value.jumlah8 = value.jumlah8 ? value.jumlah8 : 0;
          value.jumlah9 = value.jumlah9 ? value.jumlah9 : 0;
          value.jumlah10 = value.jumlah10 ? value.jumlah10 : 0;
          value.jumlah11 = value.jumlah11 ? value.jumlah11 : 0;
          value.jumlah12 = value.jumlah12 ? value.jumlah12 : 0;
          value.jumlah13 = value.jumlah13 ? value.jumlah13 : 0;
          value.jumlah14 = value.jumlah14 ? value.jumlah14 : 0;
          value.jumlah15 = value.jumlah15 ? value.jumlah15 : 0;
          value.jumlah16 = value.jumlah16 ? value.jumlah16 : 0;
          value.jumlah17 = value.jumlah17 ? value.jumlah17 : 0;
          value.jumlah18 = value.jumlah18 ? value.jumlah18 : 0;
          value.jumlah19 = value.jumlah19 ? value.jumlah19 : 0;
          value.jumlah20 = value.jumlah20 ? value.jumlah20 : 0;
          value.jumlah21 = value.jumlah21 ? value.jumlah21 : 0;
          value.jumlah22 = value.jumlah22 ? value.jumlah22 : 0;
          value.is_pensiun = is_pensiun;

          await repoEspt.upsert(value);
        });
      }
    }

  }
  return "done";
}

async function getAllDataEspt(req) {
  let filter = {};

  let maps = {};

  let resEspt = await repoEspt.acquiredAllDataEspt(
    req.body.npp,
    req.body.kd_comp
  );

  let resComp = await repoCompany.acquireById(resEspt.company_id_asal);

  // return resComp
  maps.employee_id = resEspt.id;
  maps.npp = resEspt.npp;
  maps.kd_comp = resEspt.company_id_asal;

  let espt = resEspt.espt;

  espt.forEach((value, index) => {
    maps.nik = value.nik;
    maps.nama = value.nama;
    maps.alamat = value.alamat;
    maps.jenis_kelamin = value.jenis_kelamin;
    maps.masa_pajak = value.masa_pajak;
    maps.tahun_pajak = value.tahun_pajak;
    maps.pembetulan = value.pembetulan;
    maps.seq_no = value.seq_no;
    maps.masa_perolehan_lama = value.masa_perolehan_lama;
    maps.masa_perolehan_akhir = value.masa_perolehan_akhir;
    maps.npwp = value.npwp;
    maps.status_ptkp = value.status_ptkp;
    maps.position = value.position;
    maps.jml_tanggungan = value.jml_tanggungan;
    maps.wp_luarnegeri = value.wp_luarnegeri;
    maps.kode_negara = value.kode_negara;
    maps.kode_pajak = value.kode_pajak;
    maps.status_pindah = value.status_pindah;
    maps.npwp_pemotong = value.npwp_pemotong;
    maps.nama_pemotong = value.nama_pemotong;
    maps.tgl_bukti_potong = value.tgl_bukti_potong;
    maps.spt_no = value.spt_no;
    maps.alamat = value.alamat;
    maps.jumlah1 = value.jumlah1;
    maps.jumlah2 = value.jumlah2;
    maps.jumlah3 = value.jumlah3;
    maps.jumlah4 = value.jumlah4;
    maps.jumlah5 = value.jumlah5;
    maps.jumlah6 = value.jumlah6;
    maps.jumlah7 = value.jumlah7;
    maps.jumlah8 = value.jumlah8;
    maps.jumlah9 = value.jumlah9;
    maps.jumlah10 = value.jumlah10;
    maps.jumlah11 = value.jumlah11;
    maps.jumlah12 = value.jumlah12;
    maps.jumlah13 = value.jumlah13;
    maps.jumlah14 = value.jumlah14;
    maps.jumlah15 = value.jumlah15;
    maps.jumlah16 = value.jumlah16;
    maps.jumlah17 = value.jumlah17;
    maps.jumlah18 = value.jumlah18;
    maps.jumlah19 = value.jumlah19;
    maps.jumlah20 = value.jumlah20;
    maps.jumlah21 = value.jumlah21;
    maps.jumlah22 = value.jumlah22;
  });

  // return resEspt

  return maps;
}

module.exports = {
  serviceSap,
  getAllDataEspt,
};
