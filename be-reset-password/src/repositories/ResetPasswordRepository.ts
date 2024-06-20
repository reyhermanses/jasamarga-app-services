import UserAuth from "../models/UserAuth";
import Employee from "../models/Employee";
import Profile from "../models/Profile";
import ResetPassword from "../models/ResetPassword";

import { Op } from "sequelize";

import sequelize from "../config/Sequelize";
import MasterCompany from "../models/MasterCompany";

interface FilterOptions {
  attributes?: any[];
  include: any[];
  where?: any;
}

export class ResetPasswordRepository {
  static getUserAuth = async (query: any): Promise<any> => {
    let filterAll: FilterOptions = {
      attributes: [
        "id",
        "employee_id",
        "username",
        "password",
        "default_password",
        [sequelize.literal(`"employee"."name"`), "name"],
        [sequelize.literal(`"employee->company"."name"`), "company_name"],
        [sequelize.literal(`"employee->company"."nm_singkatan"`), "kd_comp"],
        [
          sequelize.literal(`"employee->profile"."email_perusahaan"`),
          "email_perusahaan",
        ],
        [
          sequelize.literal(`"employee->profile"."email_pribadi"`),
          "email_pribadi",
        ],
      ],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: [],
          include: [
            {
              model: Profile,
              as: "profile",
              attributes: [],
            },
            {
              model: MasterCompany,
              as: "company",
              attributes: [],
            },
          ],
        },
      ],
    };

    if (query) {
      if (query.username) {
        filterAll.where = {
          username: { [Op.like]: `%${query.username}%` },
        };
      }
      if (query.is_pusat) {
        filterAll.include[0].where = {
          is_pusat: query.is_pusat,
        };
      }
    }

    // filterAll.offset = 0;
    // filterAll.limit = 200;

    // console.log(UserAuth.findAll(filterAll).toSql());

    return await UserAuth.findAll(filterAll);
  };

  static getUserByEmployeeId = async (employee_id: number): Promise<any> => {
    let filterAll: FilterOptions = {
      attributes: [
        "id",
        "employee_id",
        "username",
        "password",
        "default_password",
        [sequelize.literal(`"employee"."name"`), "name"],
        [
          sequelize.literal(`"employee->profile"."email_perusahaan"`),
          "email_perusahaan",
        ],
        [
          sequelize.literal(`"employee->profile"."email_pribadi"`),
          "email_pribadi",
        ],
      ],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: [],
          include: [
            {
              model: Profile,
              as: "profile",
              attributes: [],
            },
          ],
        },
      ],
    };

    if (employee_id) {
      filterAll.where = { employee_id: employee_id };
    }

    return await UserAuth.findOne(filterAll);
  };

  static getUser = async (username: any) => {
    let filterAll: FilterOptions = {
      attributes: [
        "id",
        "employee_id",
        "username",
        "password",
        [sequelize.literal(`"employee"."name"`), "name"],
        [
          sequelize.literal(`"employee->profile"."email_perusahaan"`),
          "email_perusahaan",
        ],
        [
          sequelize.literal(`"employee->profile"."email_pribadi"`),
          "email_pribadi",
        ],
      ],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: [],
          include: [
            {
              model: Profile,
              as: "profile",
              attributes: [],
            },
          ],
        },
      ],
    };

    if (username) {
      filterAll.where = { username: username };
    }

    return await UserAuth.findOne(filterAll);
  };

  static updateUserAuth = async (
    employee_id: number,
    data: any
  ): Promise<any> => {
    return await UserAuth.update(data, {
      where: {
        employee_id: employee_id,
      },
    });
  };

  static updateResetPassword = async (
    employee_id: number,
    data: any
  ): Promise<any> => {
    return await ResetPassword.update(data, {
      where: {
        employee_id: employee_id,
      },
    });
  };

  static createResetPassword = async (data: any): Promise<any> => {
    return await ResetPassword.create(data);
  };

  static acquiredRandomString = async (token: string): Promise<any> => {
    return await ResetPassword.findOne({
      where: {
        random: token,
      },
    });
  };
}
