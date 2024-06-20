import { NextFunction, Request, Response } from "express";
import ResetPasswordUser from "../models/ResetPasswordUser";
import ResetPasswordRole from "../models/ResetPasswordRole";
import MasterPosition from "../models/MasterPosition";
import UserAuth from "../models/UserAuth";
import EmployeePosition from "../models/EmployeePosition";
import sequelize from "../config/Sequelize";
import Employee from "../models/Employee";
import Profile from "../models/Profile";
import MasterCompany from "../models/MasterCompany";
import { Op } from "sequelize";
import OrganizationHierarchy from "../models/OrganizationHierarchy";

interface FilterOptions {
  attributes?: any[];
  include: any[];
  where?: any;
  offset?: any;
  limit?: any;
  order?: any[];
}

interface TestFilter {
  test?: any;
}

export class UserRepository {
  static create = async (data: any) => {
    return await ResetPasswordUser.create(data);
  };

  static read = async (filter: any) => {
    return await ResetPasswordUser.findAll({
      include: [{ model: ResetPasswordRole, as: "roles" }],
    });
  };

  static update = async (id: string, data: any) => {
    return await ResetPasswordUser.update(data, {
      where: {
        id: id,
      },
    });
  };

  static delete = async (id: string) => {
    return await ResetPasswordUser.destroy({
      where: {
        id: id,
      },
    });
  };

  static acquiredUserAuth = async (req: Request, res: Response) => {
    let filterRaw: string = "";
    let filterRawUsername: string = "";
    let filterRawName: string = "";
    let filterRawCompanyName: string = "";
    let filterUnit: string = "";
    let filterKdComp: string = "";
    const filter: FilterOptions = {
      attributes: [
        [sequelize.literal(`"position->user_auth"."id"`), "id"],
        [
          sequelize.literal(`"position->user_auth"."employee_id"`),
          "employee_id",
        ],
        [sequelize.literal(`"position->user_auth"."username"`), "username"],
        [sequelize.literal(`"unit"."name"`), "unit_kerja_name"],
        [sequelize.literal(`"position->user_auth"."password"`), "password"],
        [
          sequelize.literal(`"position->user_auth"."default_password"`),
          "default_password",
        ],
        [sequelize.literal(`"position->user_auth->employee"."name"`), "name"],
        [
          sequelize.literal(`"position->user_auth->employee->company"."name"`),
          "company_name",
        ],
        [
          sequelize.literal(
            `"position->user_auth->employee->company"."kd_comp"`
          ),
          "company_code",
        ],
        [
          sequelize.literal(
            `"position->user_auth->employee->company"."nm_singkatan"`
          ),
          "kd_comp",
        ],
        [
          sequelize.literal(
            `"position->user_auth->employee->profile"."email_perusahaan"`
          ),
          "email_perusahaan",
        ],
        [
          sequelize.literal(
            `"position->user_auth->employee->profile"."email_pribadi"`
          ),
          "email_pribadi",
        ],
      ],
      include: [
        {
          model: EmployeePosition,
          as: "position",
          attributes: [],
          required: true,
          include: [
            {
              required: true,
              model: UserAuth,
              as: "user_auth",
              include: [
                {
                  model: Employee,
                  as: "employee",
                  required: true,
                  attributes: [],
                  include: [
                    {
                      model: Profile,
                      as: "profile",
                      required: true,
                      attributes: [],
                    },
                    {
                      model: MasterCompany,
                      as: "company",
                      required: true,
                      attributes: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: OrganizationHierarchy,
          as: "unit",
          required: true,
          attributes: [],
        },
      ],
    };

    if (req.user.unit_kerja_id) {
      if (
        req.user.unit_kerja_id != "40000071" &&
        req.user.unit_kerja_id != "40000020"
      ) {
        filter.where = {
          unit_kerja_id: req.user.unit_kerja_id,
        };
        filterRaw = "and unit_kerja_id = " + req.user.unit_kerja_id;
      }
    }

    if (req.query.username) {
      filterRawUsername = `and ua.username ilike '%${req.query.username}%'`;
      filter.include[0].include[0].where = {
        username: { [Op.iLike]: `%${req.query.username}%` },
      };
    }
    if (req.query.name) {
      filterRawName = `and e.name ilike '%${req.query.name}%'`;
      filter.include[0].include[0].include[0].where = {
        name: { [Op.iLike]: `%${req.query.name}%` },
      };
    }
    if (req.query.company_name) {
      filterRawCompanyName = `and mc.name ilike '%${req.query.company_name}%'`;
      filter.include[0].include[0].include[0].include[1].where = {
        name: { [Op.iLike]: `%${req.query.company_name}%` },
      };
    }

    if (req.query.company_code) {
      filterKdComp = `and mc.kd_comp ilike '%${req.query.company_code}%'`;
      filter.include[0].include[0].include[0].include[1].where = {
        kd_comp: { [Op.iLike]: `%${req.query.company_code}%` },
      };
    }

    if (req.query.unit_kerja_name) {
      filterUnit = `and oh.name ilike '%${req.query.unit_kerja_name}%'`;
      filter.include[1].where = {
        name: { [Op.iLike]: `%${req.query.unit_kerja_name}%` },
      };
    }
    try {
      const dt: any = await sequelize.query(
        `select count(*) from "${process.env.NODE_ENV}".master_position mp
        join "${process.env.NODE_ENV}".employee_position ep on mp.id = ep.position_id 
        join "${process.env.NODE_ENV}".organization_hierarchy oh on mp.unit_kerja_id  = oh.id 
        join "${process.env.NODE_ENV}".user_auth ua on ep.employee_id = ua.employee_id 
        join "${process.env.NODE_ENV}".employee e on ua.employee_id = e.id 
        join "${process.env.NODE_ENV}".employee_profile ep2 on e.id =ep2.employee_id 
        join "${process.env.NODE_ENV}".master_company mc on mc.id= e.company_id_asal ${filterRaw} ${filterRawName} ${filterRawUsername} ${filterRawCompanyName} ${filterUnit} ${filterKdComp}`
      );

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      filter.offset = (page - 1) * limit;
      filter.limit = limit;
      filter.order = [["name", "ASC"]];

      const result = await MasterPosition.findAll(filter); // get all results data
      const items = result;
      // const total = Math.ceil(dt[0][0].count / limit);

      return {
        data: items,
        currentPage: page,
        totalPages: dt[0][0].count,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "An error occurred while fetching data." };
    }
  };
}
