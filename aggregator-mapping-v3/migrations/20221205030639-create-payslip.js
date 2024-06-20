'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'payslip'
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      periode: {
        type: Sequelize.DATE
      },
      gaji_pokok: {
        type: Sequelize.STRING
      },
      tunj_posisi_struktural: {
        type: Sequelize.STRING
      },
      gaji_komisaris: {
        type: Sequelize.STRING
      },
      insentif_lalin: {
        type: Sequelize.STRING
      },
      uang_pengganti: {
        type: Sequelize.STRING
      },
      kompensasi_ap: {
        type: Sequelize.STRING
      },
      tunjangan_perumahan_dir_: {
        type: Sequelize.STRING
      },
      tunjangan_transport_kom_: {
        type: Sequelize.STRING
      },
      tunjangan_telekomunikasi: {
        type: Sequelize.STRING
      },
      insentif: {
        type: Sequelize.STRING
      },
      kompensasi_penghasilan: {
        type: Sequelize.STRING
      },
      tunj_posisi_ops_grade: {
        type: Sequelize.STRING
      },
      tunj_posisi_fungsional: {
        type: Sequelize.STRING
      },
      gaji_direksi: {
        type: Sequelize.STRING
      },
      tunjangan_psl: {
        type: Sequelize.STRING
      },
      gaji_komite: {
        type: Sequelize.STRING
      },
      lalin_reg_i_masuk: {
        type: Sequelize.STRING
      },
      lalin_reg_i_keluar: {
        type: Sequelize.STRING
      },
      lalin_reg_i_terbuka: {
        type: Sequelize.STRING
      },
      lalin_reg_multi_masuk: {
        type: Sequelize.STRING
      },
      lalin_reg_multi_keluar: {
        type: Sequelize.STRING
      },
      lalin_reg_multi_terbuka: {
        type: Sequelize.STRING
      },
      lalin_gto_gol_i_masuk: {
        type: Sequelize.STRING
      },
      lalin_gto_gol_i_keluar: {
        type: Sequelize.STRING
      },
      lalin_gto_gol_i_terbuka: {
        type: Sequelize.STRING
      },
      lalin_gto_multi_masuk: {
        type: Sequelize.STRING
      },
      lalin_gto_multi_keluar: {
        type: Sequelize.STRING
      },
      lalin_gto_multi_terbuka: {
        type: Sequelize.STRING
      },
      lalin_jmpt_kndraan_masuk: {
        type: Sequelize.STRING
      },
      lalin_jmpt_trnsksi_trbuka: {
        type: Sequelize.STRING
      },
      beban_ruas_a: {
        type: Sequelize.STRING
      },
      beban_ruas_b: {
        type: Sequelize.STRING
      },
      beban_ruas_c: {
        type: Sequelize.STRING
      },
      beban_ruas_d: {
        type: Sequelize.STRING
      },
      beban_ruas_e: {
        type: Sequelize.STRING
      },
      beban_ruas_f: {
        type: Sequelize.STRING
      },
      kompensasi_kgp: {
        type: Sequelize.STRING
      },
      insentif_ramadhan: {
        type: Sequelize.STRING
      },
      tunjangan_cuti: {
        type: Sequelize.STRING
      },
      uang_lembur_150_: {
        type: Sequelize.STRING
      },
      uang_lembur_200_: {
        type: Sequelize.STRING
      },
      uang_lembur_300_: {
        type: Sequelize.STRING
      },
      uang_lembur_400_: {
        type: Sequelize.STRING
      },
      uang_lembur_fix: {
        type: Sequelize.STRING
      },
      uang_lembur_150_md: {
        type: Sequelize.STRING
      },
      uang_lembur_200_hln: {
        type: Sequelize.STRING
      },
      uang_lembur_200_md: {
        type: Sequelize.STRING
      },
      uang_makan: {
        type: Sequelize.STRING
      },
      uang_saku_transport_lokal: {
        type: Sequelize.STRING
      },
      uang_penginapan_sementara: {
        type: Sequelize.STRING
      },
      bantuan_sewa_rumah: {
        type: Sequelize.STRING
      },
      tunjangan_angkutan: {
        type: Sequelize.STRING
      },
      utb_luar_negeri: {
        type: Sequelize.STRING
      },
      utb_3_7_jam: {
        type: Sequelize.STRING
      },
      utb_7: {
        type: Sequelize.STRING
      },
      uang_transport_dlm_kota: {
        type: Sequelize.STRING
      },
      uang_transport_luar_kota: {
        type: Sequelize.STRING
      },
      uang_transport_menginap: {
        type: Sequelize.STRING
      },
      hotel: {
        type: Sequelize.STRING
      },
      pesawat: {
        type: Sequelize.STRING
      },
      uang_saku_transport_lokal_ln: {
        type: Sequelize.STRING
      },
      hotel_ln: {
        type: Sequelize.STRING
      },
      pesawat_ln: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_jr: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_jr_ps_: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_ir: {
        type: Sequelize.STRING
      },
      reimburse_kesehatan_lain: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_komisaris: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_direksi: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_ir_ps_: {
        type: Sequelize.STRING
      },
      jasprod_um_reg: {
        type: Sequelize.STRING
      },
      thr_regular: {
        type: Sequelize.STRING
      },
      jasprod_final_reg: {
        type: Sequelize.STRING
      },
      potongan_koperasi: {
        type: Sequelize.STRING
      },
      potongan_iik: {
        type: Sequelize.STRING
      },
      potongan_skjm: {
        type: Sequelize.STRING
      },
      potongan_santunan_duka: {
        type: Sequelize.STRING
      },
      potongan_lain_lain: {
        type: Sequelize.STRING
      },
      pinj_penddkn_sd: {
        type: Sequelize.STRING
      },
      potongan_perjalanan_dinas: {
        type: Sequelize.STRING
      },
      potongan_kerohanian: {
        type: Sequelize.STRING
      },
      potongan_bki: {
        type: Sequelize.STRING
      },
      potongan_bkk: {
        type: Sequelize.STRING
      },
      potongan_bkh: {
        type: Sequelize.STRING
      },
      potongan_bkb: {
        type: Sequelize.STRING
      },
      potongan_kesehatan_ii: {
        type: Sequelize.STRING
      },
      potongan_kesehatan_ji: {
        type: Sequelize.STRING
      },
      dpp_skjm_10: {
        type: Sequelize.STRING
      },
      dpc_skjm_90: {
        type: Sequelize.STRING
      },
      pinj_penddkn_smp: {
        type: Sequelize.STRING
      },
      pinj_penddkn_sma: {
        type: Sequelize.STRING
      },
      pinj_penddkn_pt: {
        type: Sequelize.STRING
      },
      pinj_um_rumah: {
        type: Sequelize.STRING
      },
      pinj_um_kendaraan: {
        type: Sequelize.STRING
      },
      pinj_renovasi_rumah: {
        type: Sequelize.STRING
      },
      pinj_multiguna: {
        type: Sequelize.STRING
      },
      pinj_kesehatan: {
        type: Sequelize.STRING
      },
      asuransi_pinjaman: {
        type: Sequelize.STRING
      },
      pembayaran_via_fa_cashier: {
        type: Sequelize.STRING
      },
      loan_balance: {
        type: Sequelize.STRING
      },
      phdp: {
        type: Sequelize.STRING
      },
      phda: {
        type: Sequelize.STRING
      },
      info_pot_kesehatan_jr: {
        type: Sequelize.STRING
      },
      gaji_jm_info: {
        type: Sequelize.STRING
      },
      gaji_ap_info: {
        type: Sequelize.STRING
      },
      info_hilang_jam_kerja: {
        type: Sequelize.STRING
      },
      info_ketidakhadiran: {
        type: Sequelize.STRING
      },
      info_kesehatan_ji: {
        type: Sequelize.STRING
      },
      info_kesehatan_ii: {
        type: Sequelize.STRING
      },
      info_pot_kesehatan_ir: {
        type: Sequelize.STRING
      },
      info_hilang_jam_kerja_tp_: {
        type: Sequelize.STRING
      },
      info_hilang_jam_kerja_md: {
        type: Sequelize.STRING
      },
      inf_ketidakhadiran_md_: {
        type: Sequelize.STRING
      },
      ee_purna_karya: {
        type: Sequelize.STRING
      },
      ee_dpjm: {
        type: Sequelize.STRING
      },
      ee_ppip_jiwasraya: {
        type: Sequelize.STRING
      },
      er_purna_karya: {
        type: Sequelize.STRING
      },
      er_dpjm: {
        type: Sequelize.STRING
      },
      er_ppip_jiwasraya: {
        type: Sequelize.STRING
      },
      bank_transfer: {
        type: Sequelize.STRING
      },
      ee_jkk: {
        type: Sequelize.STRING
      },
      ee_jht: {
        type: Sequelize.STRING
      },
      ee_jkm: {
        type: Sequelize.STRING
      },
      tunj_posisi_ops_job: {
        type: Sequelize.STRING
      },
      tunjangan_pajak: {
        type: Sequelize.STRING
      },
      ee_bpjs_hlth_stand_contrb: {
        type: Sequelize.STRING
      },
      ee_bpjs_heal_add_contrb: {
        type: Sequelize.STRING
      },
      ee_bpjs_pens_contrb_: {
        type: Sequelize.STRING
      },
      er_jkk: {
        type: Sequelize.STRING
      },
      er_jht: {
        type: Sequelize.STRING
      },
      er_jkm: {
        type: Sequelize.STRING
      },
      gaji_minus: {
        type: Sequelize.STRING
      },
      tunjangan_ap_utuh: {
        type: Sequelize.STRING
      },
      er_bpjs_heal_stand_contrib: {
        type: Sequelize.STRING
      },
      er_bpjs_heal_add_contrib: {
        type: Sequelize.STRING
      },
      er_bpjs_pens_contrib: {
        type: Sequelize.STRING
      },
      gaji_pokok_utuh: {
        type: Sequelize.STRING
      },
      total_pph21: {
        type: Sequelize.STRING
      },
      total_gaji_kotor: {
        type: Sequelize.STRING
      },
      rapel_gaji_pokok: {
        type: Sequelize.STRING
      },
      pengembalian_potongan_pinjaman: {
        type: Sequelize.STRING
      },
      rapel_tunj_posisi_struktural: {
        type: Sequelize.STRING
      },
      rapel_tunj_posisi_fungsional: {
        type: Sequelize.STRING
      },
      rapel_tunj_posisi_operasional: {
        type: Sequelize.STRING
      },
      rapel_lembur: {
        type: Sequelize.STRING
      },
      pengembalian_pot_kehadiran: {
        type: Sequelize.STRING
      },
      tunj_pos_tambahan: {
        type: Sequelize.STRING
      },
      insert_date: {
        type: Sequelize.STRING
      },
      beban_ruas_g: {
        type: Sequelize.STRING
      },
      koreksi_gaji: {
        type: Sequelize.STRING
      },
      pinj_belmera: {
        type: Sequelize.STRING
      },
      insentif_lalin_amount: {
        type: Sequelize.STRING
      },
      thr_off_cycle: {
        type: Sequelize.STRING
      },
      jasprod_um_off: {
        type: Sequelize.STRING
      },
      jasprod_final: {
        type: Sequelize.STRING
      },
      potongan_iik_1: {
        type: Sequelize.STRING
      },
      uang_makan_ln: {
        type: Sequelize.STRING
      },
      kompensasi_ap_tambahan: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.STRING
      },
      ee_purna_karya_askum: {
        type: Sequelize.STRING
      },
      er_purna_karya_askum: {
        type: Sequelize.STRING
      },
      cuti_sakit_pengurang_gaji_poko: {
        type: Sequelize.STRING
      },
      uang_pengganti_ap: {
        type: Sequelize.STRING
      },
      uang_pengganti_ist_panjang: {
        type: Sequelize.STRING
      },
      pay_type: {
        type: Sequelize.STRING
      },
      sumbangan_jasprod: {
        type: Sequelize.STRING
      },
      pajak: {
        type: Sequelize.STRING
      },
      potongan_kompensasi: {
        type: Sequelize.STRING
      },
      tantiem: {
        type: Sequelize.STRING
      },
      pajak_umjp_beban_karyawan: {
        type: Sequelize.STRING
      },
      pot_koperasi_off_cycle: {
        type: Sequelize.STRING
      },
      pengembalian_thr: {
        type: Sequelize.STRING
      },
      pajak_insentif_beban_karyawan: {
        type: Sequelize.STRING
      },
      insentif_satgas: {
        type: Sequelize.STRING
      },
      pajak_jp_beban_karyawan: {
        type: Sequelize.STRING
      },
      uang_pengganti_jm: {
        type: Sequelize.STRING
      },
      rapel_ee_purna_karya: {
        type: Sequelize.STRING
      },
      rapel_er_purna_karya: {
        type: Sequelize.STRING
      },
      rapel_ee_askum: {
        type: Sequelize.STRING
      },
      rapel_er_askum: {
        type: Sequelize.STRING
      },
      er_iuran_pasti: {
        type: Sequelize.STRING
      },
      ee_iuran_pasti: {
        type: Sequelize.STRING
      },
      phdp_tambahan: {
        type: Sequelize.STRING
      },
      bank_trf_control: {
        type: Sequelize.STRING
      },
      rapel_ee_iuran_pasti: {
        type: Sequelize.STRING
      },
      rapel_er_iuran_pasti: {
        type: Sequelize.STRING
      },
      tunj_posisi_ops_job_x_: {
        type: Sequelize.STRING
      },
      tunj_posisi_fungsional_x_: {
        type: Sequelize.STRING
      },
      info_kesehatan_ii_x_: {
        type: Sequelize.STRING
      },
      info_kesehatan_ji_x_: {
        type: Sequelize.STRING
      },
      potongan_kesehatan_ji_x_: {
        type: Sequelize.STRING
      },
      potongan_kesehatan_ii_x_: {
        type: Sequelize.STRING
      },
      reimburse_kesehatan_lain_x_: {
        type: Sequelize.STRING
      },
      uang_saku_transport_lokal_ln_x: {
        type: Sequelize.STRING
      },
      uang_saku_transport_lokal_x_: {
        type: Sequelize.STRING
      },
      uang_makan_x_: {
        type: Sequelize.STRING
      },
      uang_makan_ln_x_: {
        type: Sequelize.STRING
      },
      info_pot_ap_lainnya: {
        type: Sequelize.STRING
      },
      upah_bpjs_naker_ap: {
        type: Sequelize.STRING
      },
      upah_bpjs_naker_induk: {
        type: Sequelize.STRING
      },
      ongkos_istirahat_panjang: {
        type: Sequelize.STRING
      },
      tunj_multiple_assignment: {
        type: Sequelize.STRING
      },
      payment_external: {
        type: Sequelize.STRING
      },
      info_ketidakhadiran_md_: {
        type: Sequelize.STRING
      },
      retro: {
        type: Sequelize.STRING
      },
      tunjangan_khusus: {
        type: Sequelize.STRING
      },
      pinj_mpp: {
        type: Sequelize.STRING
      },
      tunjangan_tambahan: {
        type: Sequelize.STRING
      },
      bank_account: {
        type: Sequelize.STRING
      },
      bank_name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      is_publish: {
        type: Sequelize.STRING
      },
      npp: {
        type: Sequelize.STRING
      },
      kd_comp: {
        type: Sequelize.STRING
      },
      potongan_kop_kkjm: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_aso: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_jr_py_: {
        type: Sequelize.STRING
      },
      tunj_kesehatan_ir_py_: {
        type: Sequelize.STRING
      },
      info_pot_kesehatan_jr_x_: {
        type: Sequelize.STRING
      },
      info_pot_kesehatan_ir_x_: {
        type: Sequelize.STRING
      },
      reimburse_kesehatan_lain_py_: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING,
      },
      updated_by: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};