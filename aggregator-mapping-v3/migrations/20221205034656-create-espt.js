'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'espt'
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
      jumlah21: {
        type: Sequelize.BIGINT
      },
      jumlah22: {
        type: Sequelize.BIGINT
      },
      masa_pajak: {
        type: Sequelize.INTEGER
      },
      tahun_pajak: {
        type: Sequelize.INTEGER
      },
      pembetulan: {
        type: Sequelize.STRING
      },
      seq_no: {
        type: Sequelize.STRING
      },
      masa_perolehan_awal: {
        type: Sequelize.STRING
      },
      masa_perolehan_akhir: {
        type: Sequelize.STRING
      },
      npwp: {
        type: Sequelize.STRING
      },
      status_ptkp: {
        type: Sequelize.STRING
      },
      // position_id: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'master_position',
      //     key: 'id'
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // },
      jml_tanggungan: {
        type: Sequelize.INTEGER
      },
      wp_luarnegri: {
        type: Sequelize.STRING
      },
      kode_negara: {
        type: Sequelize.STRING
      },
      kode_pajak: {
        type: Sequelize.STRING
      },
      jumlah1: {
        type: Sequelize.BIGINT
      },
      jumlah2: {
        type: Sequelize.BIGINT
      },
      jumlah3: {
        type: Sequelize.BIGINT
      },
      jumlah4: {
        type: Sequelize.BIGINT
      },
      jumlah5: {
        type: Sequelize.BIGINT
      },
      jumlah6: {
        type: Sequelize.BIGINT
      },
      jumlah7: {
        type: Sequelize.BIGINT
      },
      jumlah8: {
        type: Sequelize.BIGINT
      },
      jumlah9: {
        type: Sequelize.BIGINT
      },
      jumlah10: {
        type: Sequelize.BIGINT
      },
      jumlah11: {
        type: Sequelize.BIGINT
      },
      jumlah12: {
        type: Sequelize.BIGINT
      },
      jumlah13: {
        type: Sequelize.BIGINT
      },
      jumlah14: {
        type: Sequelize.BIGINT
      },
      jumlah15: {
        type: Sequelize.BIGINT
      },
      jumlah16: {
        type: Sequelize.BIGINT
      },
      jumlah17: {
        type: Sequelize.BIGINT
      },
      jumlah18: {
        type: Sequelize.BIGINT
      },
      jumlah19: {
        type: Sequelize.BIGINT
      },
      jumlah20: {
        type: Sequelize.BIGINT
      },
      status_pindah: {
        type: Sequelize.STRING
      },
      npwp_pemotong: {
        type: Sequelize.STRING
      },
      nama_pemotong: {
        type: Sequelize.STRING
      },
      tgl_bukti_pemotong: {
        type: Sequelize.DATE
      },
      spt_no: {
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
      },
      position: {
        type: Sequelize.STRING(100)
      },
      wp_luarnegeri: {
        type: Sequelize.STRING(100)
      },
      tgl_bukti_potong: {
        type: Sequelize.DATE
      },
      nik: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      jenis_kelamin: {
        type: Sequelize.STRING
      },
      // npp: {
      //   type: Sequelize.STRING
      // },
      // kd_comp: {
      //   type: Sequelize.STRING
      // }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};