import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class Payslip extends Model {
  public id!: number;
  public Periode!: string;
	public Personnel_No!: string;
	public "GAJI POKOK"!: string;
	public "TUNJ. POSISI STRUKTURAL"!: string;
	public "GAJI KOMISARIS"!: string;
	public "INSENTIF LALIN"!: string;
	public "UANG PENGGANTI"!: string;
	public "KOMPENSASI AP"!: string;
	public "TUNJANGAN PERUMAHAN (DIR)"!: string;
	public "TUNJANGAN TRANSPORT (KOM)"!: string;
	public "TUNJANGAN TELEKOMUNIKASI"!: string;
	public INSENTIF!: string;
	public "KOMPENSASI PENGHASILAN"!: string;
	public "TUNJ. POSISI OPS GRADE"!: string;
	public "TUNJ. POSISI FUNGSIONAL"!: string;
	public "GAJI DIREKSI"!: string;
	public "TUNJANGAN PSL"!: string;
	public "GAJI KOMITE"!: string;
	public "LALIN REG I MASUK"!: string;
	public "LALIN REG I KELUAR"!: string;
	public "UANG LEMBUR 300%"!: string;
	public "UANG LEMBUR 400%"!: string;
	public "UANG LEMBUR FIX"!: string;
	public "UANG LEMBUR 150% MD"!: string;
	public "UANG LEMBUR 200% HLN"!: string;
	public "UANG LEMBUR 200% MD"!: string;
	public "UANG MAKAN"!: string;
	public "UANG SAKU TRANSPORT LOKAL (X)"!: string;
	public "UANG PENGINAPAN SEMENTARA"!: string;
	public "BANTUAN SEWA RUMAH"!: string;
	public "TUNJANGAN ANGKUTAN"!: string;
	public "UTB LUAR NEGERI"!: string;
	public "UTB >=3<=7 JAM"!: string;
	public "UTB > 7"!: string;
	public "UANG TRANSPORT DLM KOTA"!: string;
	public "UANG TRANSPORT LUAR KOTA"!: string;
	public "UANG TRANSPORT MENGINAP"!: string;
	public HOTEL!: string;
	public PESAWAT!: string;
	public "UANG MAKAN LN (X)"!: string;
	public "UANG SAKU TRANSPORT LOKAL LN (X)"!: string;
	public "HOTEL LN"!: string;
	public "PESAWAT LN"!: string;
	public "TUNJ. KESEHATAN JR"!: string;
	public "TUNJ. KESEHATAN JR (PS)"!: string;
	public "TUNJ. KESEHATAN IR"!: string;
	public "REIMBURSE KESEHATAN LAIN"!: string;
	public "TUNJ. KESEHATAN KOMISARIS"!: string;
	public "TUNJ. KESEHATAN DIREKSI"!: string;
	public "TUNJ. KESEHATAN IR (PS)"!: string;
	public "REIMBURSE KESEHATAN LAIN (X)"!: string;
	public "JASPROD UM REG"!: string;
	public "THR OFF-CYCLE"!: string;
	public "THR REGULAR"!: string;
	public "JASPROD UM OFF"!: string;
	public "JASPROD FINAL REG"!: string;
	public "JASPROD FINAL OFF"!: string;
	public "POTONGAN KOPERASI"!: string;
	public "POTONGAN IIK"!: string;
	public "POTONGAN SKJM"!: string;
	public "POTONGAN SANTUNAN DUKA"!: string;
	public "POTONGAN LAIN-LAIN"!: string;
	public "PINJ PENDDKN SD"!: string;
	public "POTONGAN PERJALANAN DINAS"!: string;
	public "POTONGAN KEROHANIAN"!: string;
	public "POTONGAN BKI"!: string;
	public "POTONGAN BKK"!: string;
	public "POTONGAN BKH"!: string;
	public "POTONGAN BKB"!: string;
	public "POTONGAN KESEHATAN II"!: string;
	public "POTONGAN KESEHATAN JI"!: string;
	public "POTONGAN KESEHATAN II (X)"!: string;
	public "POTONGAN KESEHATAN JI (X)"!: string;
	public "10% DPP - SKJM"!: string;
	public "90% DPC - SKJM"!: string;
	public "PINJ PENDDKN SMP"!: string;
	public "PINJ PENDDKN SMA"!: string;
	public "PINJ PENDDKN PT"!: string;
	public "PINJ UM RUMAH"!: string;
	public "PINJ UM KENDARAAN"!: string;
	public "PINJ RENOVASI RUMAH"!: string;
	public "PINJ MULTIGUNA"!: string;
	public "PINJ KESEHATAN"!: string;
	public "PINJ MPP"!: string;
	public "PEMBAYARAN VIA FA CASHIER"!: string;
	public "ASURANSI PINJAMAN"!: string;
	public PHDP!: string;
	public PHDA!: string;
	public "INFO POT. KESEHATAN JR"!: string;
	public "INFO POT. KESEHATAN JR (X)"!: string;
	public "GAJI JM INFO"!: string;
	public "GAJI AP INFO"!: string;
	public "INFO HILANG JAM KERJA"!: string;
	public "INFO KETIDAKHADIRAN"!: string;
	public "INFO KESEHATAN JI"!: string;
	public "INFO KESEHATAN II"!: string;
	public "INFO POT. KESEHATAN IR"!: string;
	public "INFO KESEHATAN JI (X)"!: string;
	public "INFO KESEHATAN II (X)"!: string;
	public "INFO POT. KESEHATAN IR (X)"!: string;
	public "INFO HILANG JAM KERJA (TP)"!: string;
	public "INFO HILANG JAM KERJA MD"!: string;
	public "INFO KETIDAKHADIRAN (MD)"!: string;
	public "EE PURNA KARYA"!: string;
	public "EE DPJM"!: string;
	public "EE PPIP JIWASRAYA"!: string;
	public "ER PURNA KARYA"!: string;
	public "ER DPJM"!: string;
	public "ER PPIP JIWASRAYA"!: string;
	public "BANK TRANSFER"!: string;
	public "EE JKK"!: string;
	public "EE JHT"!: string;
	public "EE JKM"!: string;
	public "TUNJ. POSISI OPS JOB"!: string;
	public "TUNJANGAN PAJAK"!: string;
	public "EE BPJS HLTH STAND.CONTRB"!: string;
	public "EE BPJS HEAL .ADD.CONTRB"!: string;
	public "ER BPJS PENS CONTRIB"!: string;
	public "TUNJ. POSISI FUNGSIONAL (X)"!: string;
	public "TUNJ. POSISI OPS JOB (X)"!: string;
	public "GAJI POKOK UTUH"!: string;
	public "TOTAL PPH21"!: string;
	public "POTONGAN IIK 1"!: string;
	public "TOTAL GAJI KOTOR"!: string;
	public "RAPEL GAJI POKOK"!: string;
	public "PENGEMBALIAN POTONGAN PINJAMAN"!: string;
	public "UANG PENGGANTI JM"!: string;
	public "TUNJ.POS FUNGS TAMBAHAN"!: string;
	public "TUNJ.POS OPR TAMBAHAN"!: string;
	public "RAPEL LEMBUR"!: string;
	public "PENGEMBALIAN POT KEHADIRAN"!: string;
	public "TUNJ POS TAMBAHAN"!: string;
	public "KOREKSI GAJI"!: string;
	public "PINJ BELMERA"!: string;
	public "INSENTIF LALIN AMOUNT"!: string;
	public "KOMPENSASI AP TAMBAHAN"!: string;
	public "EE PURNA KARYA ASKUM"!: string;
	public "ER PURNA KARYA ASKUM"!: string;
	public "CUTI SAKIT PENGURANG GAJI POKOK"!: string;
	public "UANG PENGGANTI AP"!: string;
	public "UANG PENGGANTI IST PANJANG"!: string;
	public "POTONGAN KOMPENSASI"!: string;
	public TANTIEM!: string;
	public "PAJAK JP BEBAN KARYAWAN"!: string;
	public "POT. KOPERASI OFF-CYCLE"!: string;
	public "INSENTIF SATGAS"!: string;
	public "PAJAK INSENTIF BEBAN KARYAWAN"!: string;
	public "PENGEMBALIAN THR"!: string;
	public "RAPEL EE PURNA KARYA"!: string;
	public "RAPEL ER PURNA KARYA"!: string;
	public "RAPEL EE ASKUM"!: string;
	public "RAPEL ER ASKUM"!: string;
	public "ER IURAN PASTI"!: string;
	public "EE IURAN PASTI"!: string;
	public "PHDP TAMBAHAN"!: string;
	public "BANK TRF CONTROL"!: string;
	public "RAPEL EE IURAN PASTI"!: string;
	public "RAPEL ER IURAN PASTI"!: string;
	public "INFO POT.AP LAINNYA"!: string;
	public "UPAH BPJS NAKER INDUK"!: string;
	public "UPAH BPJS NAKER AP"!: string;
	public "ONGKOS ISTIRAHAT PANJANG"!: string;
	public "TUNJ MULTIPLE ASSIGNMENT"!: string;
	public "PAYMENT EXTERNAL"!: string;
	public RETRO!: string;
	public "TUNJANGAN KHUSUS"!: string;
	public "TUNJANGAN TAMBAHAN"!: string;
	public "POTONGAN KOP. KKJM"!: string;
	public "TUNJ. KESEHATAN JR (PY)"!: string;
	public "TUNJ. KESEHATAN IR (PY)"!: string;
	public "REIMBURSE KESEHATAN LAIN (PY)"!: string;
	public "TUNJ. KESEHATAN ASO"!: string;
	public "TUNJ.POS STRUK TAMBAHAN"!: string;
	public "TANTIEM INFO"!: string;
	public "PESANGON INFO"!: string;
	public "POTONGAN PAJAK"!: string;
	public "POT. PAJAK TANTIEM INFO"!: string;
	public "POT. PAJAK PESANGON INFO"!: string;
	public HONORARIUM!: string;
	public "PAYMENT EXTERNAL SPPD"!: string;
	public "GAJI POKOK INFO"!: string;
	public "NATURA INFO"!: string;
 	public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Payslip.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Personnel_No: {
      type: DataTypes.STRING,
    },
    Periode: {
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
  },{
    sequelize,
    modelName: 'Payslip',
    tableName: 'payslip',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Payslip;