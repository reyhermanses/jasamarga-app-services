import { NextFunction, Request, Response } from "express";
import ModelRegistrationMember from "../models/ModelRegistrationMember";
import { Op } from "sequelize";
import ModelRegistration from "../models/ModelRegistration";
import ModelBusMember from "../models/ModelBusMember";
import ModelMasterRute from "../models/ModelMasterRute";
import ModelMasterChildRute from "../models/ModelMasterChildRute";
import ModelMasterKabupaten from "../models/ModelMasterKabupaten";
import ModelMasterKecamatan from "../models/ModelMasterKecamatan";

ModelRegistrationMember.hasMany(ModelBusMember, {
  as: "passengers",
  sourceKey: "id",
  foreignKey: "registration_member_id",
});

// ModelMasterChildRute.hasOne(ModelMasterKecamatan, {
//   as: "camat",
//   sourceKey: "kecamatan_id",
//   foreignKey: "id",
// });

export class RepositoryRegistrationMember {
  static async create(req: Request, res: Response) {
    return await ModelRegistrationMember.create(req.body);
  }
  static async create_collection(data: any) {
    return await ModelRegistrationMember.create(data);
  }
  static async update(req: Request, res: Response) {
    return await ModelRegistrationMember.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
  }
  static async delete(req: Request, res: Response) {
    return await ModelRegistrationMember.destroy({
      where: {
        id: req.params.id,
      },
    });
  }
  static async findAll(req: Request, res: Response) {
    let filterTicket = [];
    let filterAll: { where?: any; attributes?: any; include?: any } = {
      include: [
        {
          model: ModelRegistration,
          as: "tiket",
          include: [
            {
              model: ModelMasterRute,
              as: "kota_tujuan_akhir",
              include: [
                {
                  model: ModelMasterKabupaten,
                  as: "kabupaten",
                },
              ],
            },
            {
              model: ModelMasterChildRute,
              as: "kota_tujuan",
              include: [
                {
                  model: ModelMasterKecamatan,
                  as: "kecamatan",
                },
              ],
            },
          ],
        },
      ],
    };

    if (req.query.ticket_number) {
      // filterAll.include[0].where = {registration_number: req.query.ticket_number}
      let obj = {
        registraion_number: req.query.ticket_number,
      };
      filterTicket.push(obj);
    }

    if (req.query.ticket_status) {
      // filterAll.include[0].where = {status: req.query.ticket_status}
      let obj = {
        status: req.query.ticket_status,
      };

      filterTicket.push(obj);
    }

    if (filterTicket.length !== 0) {
      filterAll.include[0].where = {
        [Op.or]: filterTicket,
      };
    }

    // Conditional includes based on query parameter
    if (req.query.show_all) {
      switch (req.query.show_all) {
        case "register_relasi_child":
          filterAll.include.push({
            model: ModelRegistrationMember,
            as: "collection_relasi",
            required: false,
          });
          break;
        case "only_register":
          filterAll.include.push({
            model: ModelRegistrationMember,
            as: "collection_relasi",
            required: true,
            attributes: [],
          });
          break;
        case "only_relasi":
          filterAll.where = { parent_id: { [Op.not]: null } };
          break;
      }
    }

    return await ModelRegistrationMember.findAll(filterAll);
  }

  static async findAllMemberByTickets(ticket_number: string) {
    let filterAll: { where?: any; attributes?: any; include?: any } = {
      include: [
        {
          model: ModelRegistration,
          as: "tiket",
          where: { registration_number: ticket_number },
        },
      ],
    };
    return await ModelRegistrationMember.findAll(filterAll);
  }

  static async findById(id: number) {
    return await ModelRegistrationMember.findByPk(id);
  }

  static async findByParentId(parent_id: number) {
    return await ModelRegistrationMember.findOne({
      where: {
        parent_id: parent_id,
      },
    });
  }

  static async findByNoKtp(no_ktp: string) {
    return await ModelRegistrationMember.findOne({
      where: {
        no_ktp: no_ktp,
      },
    });
  }

  static async findByNoHp(no_hp: number) {
    return await ModelRegistrationMember.findOne({
      where: {
        no_hp: no_hp,
      },
    });
  }

  static async findRegistrationMemberWithBusMemberByRegistrationId(
    registration_id: string
  ) {
    return await ModelRegistrationMember.findAll({
      where: {
        registration_id: registration_id,
      },
      include: [
        {
          model: ModelBusMember,
          as: "passengers",
          required: true,
        },
      ],
    });
  }
}
