'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Espt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Espt.init({
    nik : DataTypes.STRING,
    nama : DataTypes.STRING,
    alamat : DataTypes.STRING,
    jenis_kelamin : DataTypes.STRING,
    masa_pajak: DataTypes.STRING,
    tahun_pajak: DataTypes.STRING,
    pembetulan: DataTypes.STRING,
    seq_no: DataTypes.STRING,
    masa_perolehan_awal: DataTypes.STRING,
    masa_perolehan_akhir: DataTypes.STRING,
    npwp: DataTypes.STRING,
    status_ptkp: DataTypes.STRING,
    position: DataTypes.STRING,
    jml_tanggungan : DataTypes.STRING,
    wp_luarnegeri : DataTypes.STRING,
    kode_negara : DataTypes.STRING,
    kode_pajak : DataTypes.STRING,
    jumlah1: DataTypes.INTEGER,
    jumlah2: DataTypes.INTEGER,
    jumlah3: DataTypes.INTEGER,
    jumlah4: DataTypes.INTEGER,
    jumlah5: DataTypes.INTEGER,
    jumlah6: DataTypes.INTEGER,
    jumlah7: DataTypes.INTEGER,
    jumlah8: DataTypes.INTEGER,
    jumlah9: DataTypes.INTEGER,
    jumlah10: DataTypes.INTEGER,
    jumlah11: DataTypes.INTEGER,
    jumlah12: DataTypes.INTEGER,
    jumlah13: DataTypes.INTEGER,
    jumlah14: DataTypes.INTEGER,
    jumlah15: DataTypes.INTEGER,
    jumlah16: DataTypes.INTEGER,
    jumlah17: DataTypes.INTEGER,
    jumlah18: DataTypes.INTEGER,
    jumlah19: DataTypes.INTEGER,
    jumlah20: DataTypes.INTEGER,
    jumlah21: DataTypes.INTEGER,
    jumlah22: DataTypes.INTEGER,
    status_pindah : DataTypes.STRING,
    npwp_pemotong : DataTypes.STRING,
    nama_pemotong : DataTypes.STRING,
    tgl_bukti_potong : DataTypes.INTEGER,
    spt_no : DataTypes.STRING,
    created_by : DataTypes.STRING,
    updated_by : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Espt',
    tableName: "espt",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
    
  });
  return Espt;
};