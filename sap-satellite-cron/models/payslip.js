"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payslip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payslip.init(
    {
      Periode: {
        type: DataTypes.STRING,
      },
      Personnel_No: {
        type: DataTypes.STRING,
      },
      "GAJI POKOK": {
        type: DataTypes.STRING,
      },
      "TUNJ. POSISI STRUKTURAL": {
        type: DataTypes.STRING,
      },
      "GAJI KOMISARIS": {
        type: DataTypes.STRING,
      },
      "INSENTIF LALIN": {
        type: DataTypes.STRING,
      },
      "UANG PENGGANTI": {
        type: DataTypes.STRING,
      },
      "KOMPENSASI AP": {
        type: DataTypes.STRING,
      },
      "TUNJANGAN PERUMAHAN (DIR)": {
        type: DataTypes.STRING,
      },
      "TUNJANGAN TRANSPORT (KOM)": {
        type: DataTypes.STRING,
      },
      "TUNJANGAN TELEKOMUNIKASI": {
        type: DataTypes.STRING,
      },
      INSENTIF: {
        type: DataTypes.STRING,
      },
      "KOMPENSASI PENGHASILAN": {
        type: DataTypes.STRING,
      },
      "TUNJ. POSISI OPS GRADE": {
        type: DataTypes.STRING,
      },
      "TUNJ. POSISI FUNGSIONAL": {
        type: DataTypes.STRING,
      },
      "GAJI DIREKSI": {
        type: DataTypes.STRING,
      },
      "TUNJANGAN PSL": {
        type: DataTypes.STRING,
      },
      "GAJI KOMITE": {
        type: DataTypes.STRING,
      },
      "LALIN REG I MASUK": {
        type: DataTypes.STRING,
      },
      "LALIN REG I KELUAR": {
        type: DataTypes.STRING,
      },
      "UANG LEMBUR 300%": {
        type: DataTypes.STRING,
      },
      "UANG LEMBUR 400%": {
        type: DataTypes.STRING,
      },
      "UANG LEMBUR FIX": {
        type: DataTypes.STRING,
      },
      "UANG LEMBUR 150% MD": {
        type: DataTypes.STRING,
      },
      "UANG LEMBUR 200% HLN": {
        type: DataTypes.STRING,
      },
      "UANG LEMBUR 200% MD": {
        type: DataTypes.STRING,
      },
      "UANG MAKAN": {
        type: DataTypes.STRING,
      },
      "UANG SAKU TRANSPORT LOKAL (X)": {
        type: DataTypes.STRING,
      },
      "UANG PENGINAPAN SEMENTARA": {
        type: DataTypes.STRING,
      },
      "BANTUAN SEWA RUMAH": {
        type: DataTypes.STRING,
      },
      "TUNJANGAN ANGKUTAN": {
        type: DataTypes.STRING,
      },
      "UTB LUAR NEGERI": {
        type: DataTypes.STRING,
      },
      "UTB >=3<=7 JAM": {
        type: DataTypes.STRING,
      },
      "UTB > 7": {
        type: DataTypes.STRING,
      },
      "UANG TRANSPORT DLM KOTA": {
        type: DataTypes.STRING,
      },
      "UANG TRANSPORT LUAR KOTA": {
        type: DataTypes.STRING,
      },
      "UANG TRANSPORT MENGINAP": {
        type: DataTypes.STRING,
      },
      HOTEL: {
        type: DataTypes.STRING,
      },
      PESAWAT: {
        type: DataTypes.STRING,
      },
      "UANG MAKAN LN (X)": {
        type: DataTypes.STRING,
      },
      "UANG SAKU TRANSPORT LOKAL LN (X)": {
        type: DataTypes.STRING,
      },
      "HOTEL LN": {
        type: DataTypes.STRING,
      },
      "PESAWAT LN": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN JR": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN JR (PS)": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN IR": {
        type: DataTypes.STRING,
      },
      "REIMBURSE KESEHATAN LAIN": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN KOMISARIS": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN DIREKSI": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN IR (PS)": {
        type: DataTypes.STRING,
      },
      "REIMBURSE KESEHATAN LAIN (X)": {
        type: DataTypes.STRING,
      },
      "JASPROD UM REG": {
        type: DataTypes.STRING,
      },
      "THR OFF-CYCLE": {
        type: DataTypes.STRING,
      },
      "THR REGULAR": {
        type: DataTypes.STRING,
      },
      "JASPROD UM OFF": {
        type: DataTypes.STRING,
      },
      "JASPROD FINAL REG": {
        type: DataTypes.STRING,
      },
      "JASPROD FINAL OFF": {
        type: DataTypes.STRING,
      },
      "POTONGAN KOPERASI": {
        type: DataTypes.STRING,
      },
      "POTONGAN IIK": {
        type: DataTypes.STRING,
      },
      "POTONGAN SKJM": {
        type: DataTypes.STRING,
      },
      "POTONGAN SANTUNAN DUKA": {
        type: DataTypes.STRING,
      },
      "POTONGAN LAIN-LAIN": {
        type: DataTypes.STRING,
      },
      "PINJ PENDDKN SD": {
        type: DataTypes.STRING,
      },
      "POTONGAN PERJALANAN DINAS": {
        type: DataTypes.STRING,
      },
      "POTONGAN KEROHANIAN": {
        type: DataTypes.STRING,
      },
      "POTONGAN BKI": {
        type: DataTypes.STRING,
      },
      "POTONGAN BKK": {
        type: DataTypes.STRING,
      },
      "POTONGAN BKH": {
        type: DataTypes.STRING,
      },
      "POTONGAN BKB": {
        type: DataTypes.STRING,
      },
      "POTONGAN KESEHATAN II": {
        type: DataTypes.STRING,
      },
      "POTONGAN KESEHATAN JI": {
        type: DataTypes.STRING,
      },
      "POTONGAN KESEHATAN II (X)": {
        type: DataTypes.STRING,
      },
      "POTONGAN KESEHATAN JI (X)": {
        type: DataTypes.STRING,
      },
      "10% DPP - SKJM": {
        type: DataTypes.STRING,
      },
      "90% DPC - SKJM": {
        type: DataTypes.STRING,
      },
      "PINJ PENDDKN SMP": {
        type: DataTypes.STRING,
      },
      "PINJ PENDDKN SMA": {
        type: DataTypes.STRING,
      },
      "PINJ PENDDKN PT": {
        type: DataTypes.STRING,
      },
      "PINJ UM RUMAH": {
        type: DataTypes.STRING,
      },
      "PINJ UM KENDARAAN": {
        type: DataTypes.STRING,
      },
      "PINJ RENOVASI RUMAH": {
        type: DataTypes.STRING,
      },
      "PINJ MULTIGUNA": {
        type: DataTypes.STRING,
      },
      "PINJ KESEHATAN": {
        type: DataTypes.STRING,
      },
      "PINJ MPP": {
        type: DataTypes.STRING,
      },
      "PEMBAYARAN VIA FA CASHIER": {
        type: DataTypes.STRING,
      },
      "ASURANSI PINJAMAN": {
        type: DataTypes.STRING,
      },
      PHDP: {
        type: DataTypes.STRING,
      },
      PHDA: {
        type: DataTypes.STRING,
      },
      "INFO POT. KESEHATAN JR": {
        type: DataTypes.STRING,
      },
      "INFO POT. KESEHATAN JR (X)": {
        type: DataTypes.STRING,
      },
      "GAJI JM INFO": {
        type: DataTypes.STRING,
      },
      "GAJI AP INFO": {
        type: DataTypes.STRING,
      },
      "INFO HILANG JAM KERJA": {
        type: DataTypes.STRING,
      },
      "INFO KETIDAKHADIRAN": {
        type: DataTypes.STRING,
      },
      "INFO KESEHATAN JI": {
        type: DataTypes.STRING,
      },
      "INFO KESEHATAN II": {
        type: DataTypes.STRING,
      },
      "INFO POT. KESEHATAN IR": {
        type: DataTypes.STRING,
      },
      "INFO KESEHATAN JI (X)": {
        type: DataTypes.STRING,
      },
      "INFO KESEHATAN II (X)": {
        type: DataTypes.STRING,
      },
      "INFO POT. KESEHATAN IR (X)": {
        type: DataTypes.STRING,
      },
      "INFO HILANG JAM KERJA (TP)": {
        type: DataTypes.STRING,
      },
      "INFO HILANG JAM KERJA MD": {
        type: DataTypes.STRING,
      },
      "INFO KETIDAKHADIRAN (MD)": {
        type: DataTypes.STRING,
      },
      "EE PURNA KARYA": {
        type: DataTypes.STRING,
      },
      "EE DPJM": {
        type: DataTypes.STRING,
      },
      "EE PPIP JIWASRAYA": {
        type: DataTypes.STRING,
      },
      "ER PURNA KARYA": {
        type: DataTypes.STRING,
      },
      "ER DPJM": {
        type: DataTypes.STRING,
      },
      "ER PPIP JIWASRAYA": {
        type: DataTypes.STRING,
      },
      "BANK TRANSFER": {
        type: DataTypes.STRING,
      },
      "EE JKK": {
        type: DataTypes.STRING,
      },
      "EE JHT": {
        type: DataTypes.STRING,
      },
      "EE JKM": {
        type: DataTypes.STRING,
      },
      "TUNJ. POSISI OPS JOB": {
        type: DataTypes.STRING,
      },
      "TUNJANGAN PAJAK": {
        type: DataTypes.STRING,
      },
      "EE BPJS HLTH STAND.CONTRB": {
        type: DataTypes.STRING,
      },
      "EE BPJS HEAL .ADD.CONTRB": {
        type: DataTypes.STRING,
      },
      "ER BPJS PENS CONTRIB": {
        type: DataTypes.STRING,
      },
      "TUNJ. POSISI FUNGSIONAL (X)": {
        type: DataTypes.STRING,
      },
      "TUNJ. POSISI OPS JOB (X)": {
        type: DataTypes.STRING,
      },
      "GAJI POKOK UTUH": {
        type: DataTypes.STRING,
      },
      "TOTAL PPH21": {
        type: DataTypes.STRING,
      },
      "POTONGAN IIK 1": {
        type: DataTypes.STRING,
      },
      "TOTAL GAJI KOTOR": {
        type: DataTypes.STRING,
      },
      "RAPEL GAJI POKOK": {
        type: DataTypes.STRING,
      },
      "PENGEMBALIAN POTONGAN PINJAMAN": {
        type: DataTypes.STRING,
      },
      "UANG PENGGANTI JM": {
        type: DataTypes.STRING,
      },
      "TUNJ.POS FUNGS TAMBAHAN": {
        type: DataTypes.STRING,
      },
      "TUNJ.POS OPR TAMBAHAN": {
        type: DataTypes.STRING,
      },
      "RAPEL LEMBUR": {
        type: DataTypes.STRING,
      },
      "PENGEMBALIAN POT KEHADIRAN": {
        type: DataTypes.STRING,
      },
      "TUNJ POS TAMBAHAN": {
        type: DataTypes.STRING,
      },
      "KOREKSI GAJI": {
        type: DataTypes.STRING,
      },
      "PINJ BELMERA": {
        type: DataTypes.STRING,
      },
      "INSENTIF LALIN AMOUNT": {
        type: DataTypes.STRING,
      },
      "KOMPENSASI AP TAMBAHAN": {
        type: DataTypes.STRING,
      },
      "EE PURNA KARYA ASKUM": {
        type: DataTypes.STRING,
      },
      "ER PURNA KARYA ASKUM": {
        type: DataTypes.STRING,
      },
      "CUTI SAKIT PENGURANG GAJI POKOK": {
        type: DataTypes.STRING,
      },
      "UANG PENGGANTI AP": {
        type: DataTypes.STRING,
      },
      "UANG PENGGANTI IST PANJANG": {
        type: DataTypes.STRING,
      },
      "POTONGAN KOMPENSASI": {
        type: DataTypes.STRING,
      },
      TANTIEM: {
        type: DataTypes.STRING,
      },
      "PAJAK JP BEBAN KARYAWAN": {
        type: DataTypes.STRING,
      },
      "POT. KOPERASI OFF-CYCLE": {
        type: DataTypes.STRING,
      },
      "INSENTIF SATGAS": {
        type: DataTypes.STRING,
      },
      "PAJAK INSENTIF BEBAN KARYAWAN": {
        type: DataTypes.STRING,
      },
      "PENGEMBALIAN THR": {
        type: DataTypes.STRING,
      },
      "RAPEL EE PURNA KARYA": {
        type: DataTypes.STRING,
      },
      "RAPEL ER PURNA KARYA": {
        type: DataTypes.STRING,
      },
      "RAPEL EE ASKUM": {
        type: DataTypes.STRING,
      },
      "RAPEL ER ASKUM": {
        type: DataTypes.STRING,
      },
      "ER IURAN PASTI": {
        type: DataTypes.STRING,
      },
      "EE IURAN PASTI": {
        type: DataTypes.STRING,
      },
      "PHDP TAMBAHAN": {
        type: DataTypes.STRING,
      },
      "BANK TRF CONTROL": {
        type: DataTypes.STRING,
      },
      "RAPEL EE IURAN PASTI": {
        type: DataTypes.STRING,
      },
      "RAPEL ER IURAN PASTI": {
        type: DataTypes.STRING,
      },
      "INFO POT.AP LAINNYA": {
        type: DataTypes.STRING,
      },
      "UPAH BPJS NAKER INDUK": {
        type: DataTypes.STRING,
      },
      "UPAH BPJS NAKER AP": {
        type: DataTypes.STRING,
      },
      "ONGKOS ISTIRAHAT PANJANG": {
        type: DataTypes.STRING,
      },
      "TUNJ MULTIPLE ASSIGNMENT": {
        type: DataTypes.STRING,
      },
      "PAYMENT EXTERNAL": {
        type: DataTypes.STRING,
      },
      RETRO: {
        type: DataTypes.STRING,
      },
      "TUNJANGAN KHUSUS": {
        type: DataTypes.STRING,
      },
      "TUNJANGAN TAMBAHAN": {
        type: DataTypes.STRING,
      },
      "POTONGAN KOP. KKJM": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN JR (PY)": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN IR (PY)": {
        type: DataTypes.STRING,
      },
      "REIMBURSE KESEHATAN LAIN (PY)": {
        type: DataTypes.STRING,
      },
      "TUNJ. KESEHATAN ASO": {
        type: DataTypes.STRING,
      },
      "TUNJ.POS STRUK TAMBAHAN": {
        type: DataTypes.STRING,
      },
      "TANTIEM INFO": {
        type: DataTypes.STRING,
      },
      "PESANGON INFO": {
        type: DataTypes.STRING,
      },
      "POTONGAN PAJAK": {
        type: DataTypes.STRING,
      },
      "POT. PAJAK TANTIEM INFO": {
        type: DataTypes.STRING,
      },
      "POT. PAJAK PESANGON INFO": {
        type: DataTypes.STRING,
      },
      HONORARIUM: {
        type: DataTypes.STRING,
      },
      "PAYMENT EXTERNAL SPPD": {
        type: DataTypes.STRING,
      },
      "GAJI POKOK INFO": {
        type: DataTypes.STRING,
      },
      "NATURA INFO": {
        type: DataTypes.STRING,
      },
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payslip",
      tableName: "payslip",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Payslip;
};
