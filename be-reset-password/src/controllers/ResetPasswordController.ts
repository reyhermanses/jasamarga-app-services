import { Request, Response } from "express";
import bcrypt from "bcrypt";
import moment, { min } from "moment";

// import { ResetPasswordValidator } from "../validators/ResetPasswordValidator";
import { buildApiResponse } from "../utils/Response";
import { ResetPasswordRepository as repository } from "../repositories/ResetPasswordRepository";
import { sendEmail } from "../utils/EmailUtils";
import { validate } from "class-validator";
import ChangePasswordValidator from "../validators/ChangePasswordValidator";

import * as fs from "fs";

import * as dotenv from "dotenv";
dotenv.config();

// interface dataUser {
//   status: boolean;
//   code: number;
//   data: any;
// }

export class ResetPasswordController {
  static getUsernameResetPassword = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      let response: any = { err: [], status: false };
      let to: any = [];
      let checkUsername = await this.checkUsername(req.body.username);

      if (!checkUsername)
        return res
          .status(500)
          .send(
            buildApiResponse(
              false,
              500,
              "Username not found / Employee not JSMR"
            )
          );

      const user = await repository.getUser(req.body.username);

      if (
        !user?.dataValues.email_perusahaan &&
        !user?.dataValues.email_pribadi
      ) {
        response.status = true;
        response.err.push({
          error_message: "Email perusahaan & Email pribadi kosong",
        });
      } else {
        if (user?.dataValues.email_perusahaan) {
          to.push(`${user.dataValues.email_perusahaan}`);
        }
      }

      if (response.status) {
        return res.status(500).send(buildApiResponse(false, 422, response.err));
      }

      const saltRounds: number = 12;
      const newPassword: string = await this.newRandomPassword(12);
      const hashedPassword: string = await bcrypt.hashSync(
        newPassword,
        saltRounds
      );

      if (user && user.dataValues) {
        const userAuthDatas: any = {
          password: hashedPassword,
        };
        await repository.updateUserAuth(
          user.dataValues.employee_id,
          userAuthDatas
        );
      }

      const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PT JASAMARGA Tbk</title>
      </head>
      <body>
        <h1>Hello, ${user?.dataValues.name}!</h1>
        <p>Password baru anda : ${newPassword}.</p>
      </body>
      </html>
    `;

      const context = {
        username: "",
        link: "",
      };
      await sendEmail(to, "Reset Password", newPassword, htmlBody, context);

      return res.status(200).send(buildApiResponse(true, 200, newPassword));
    } catch (error: any) {
      const errResponse = JSON.parse(JSON.stringify(error));
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static getUsernameChangePassword = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      // let minutePlus5 = moment(Date.now()).add(5, 'minute').format('YYYY-MM-DD HH:mm:ss')
      let currentTime = moment();
      let minutePlus5 = currentTime.add(5, "minutes");
      let response: any = { err: [], status: false };
      let to: any = [];
      let checkUsername = await this.checkUsername(req.body.username);
      const emailTemplate = fs.readFileSync("template.html", "utf8");
      if (!checkUsername)
        return res
          .status(500)
          .send(
            buildApiResponse(
              false,
              500,
              "Username not found / Employee not JSMR"
            )
          );

      const user = await repository.getUser(req.body.username);

      if (
        !user?.dataValues.email_perusahaan &&
        !user?.dataValues.email_pribadi
      ) {
        response.status = true;
        response.err.push({
          error_message: "Email perusahaan & Email pribadi kosong",
        });
      } else {
        if (user?.dataValues.email_perusahaan) {
          to.push(`${user.dataValues.email_perusahaan}`);
        }
      }

      if (response.status) {
        return res.status(500).send(buildApiResponse(false, 422, response.err));
      }

      let link: any = process.env.FE_URL;
      let obj: any = {};

      if (user && user.dataValues) {
        obj = {
          employee_id: user.dataValues.employee_id,
          username: user.dataValues.username,
          random: await this.newRandomPassword(5),
          is_use: false,
          expires: minutePlus5,
          created_by: user.dataValues.name,
        };
        await repository.createResetPassword(obj);
      }

      to.push(`rijkaard@jasamarga.co.id`);

      const context = {
        name: user?.dataValues.name,
        minutePlus5: minutePlus5.format("YYYY-MM-DD HH:mm:ss"),
        link: link + "" + obj.random,
      };

      await sendEmail(to, "Rubah Password", link, emailTemplate, context);

      return res.status(200).send(buildApiResponse(true, 200, context));
    } catch (error: any) {
      const errResponse = JSON.parse(JSON.stringify(error));
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static getRandomString = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      let data: any = await repository.acquiredRandomString(req.body.string);

      if (!data)
        return res
          .status(403)
          .send(buildApiResponse(false, 403, "Token not found"));

      if (data.dataValues.is_use) {
        return res
          .status(403)
          .send(buildApiResponse(false, 403, "Token has been used"));
      }

      let now = moment(Date.now())
        .add(5, "minute")
        .format("YYYY-MM-DD HH:mm:ss");
      let parseDateExpires = moment(data.dataValues.expires).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      if (moment(Date.now()).isAfter(parseDateExpires)) {
        return res
          .status(403)
          .send(buildApiResponse(false, 403, "Token expired"));
      }

      return res.status(200).send(buildApiResponse(true, 200, "Token useable"));
    } catch (error: any) {
      const errResponse = JSON.parse(JSON.stringify(error));
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static changePassword = async (req: Request, res: Response): Promise<any> => {
    const cpv = new ChangePasswordValidator(req.body.token, req.body.password);
    const validationErrors = await validate(cpv);
    if (validationErrors.length > 0) {
      const e = validationErrors.map((err) => err.constraints);
      return res.status(400).json(buildApiResponse(false, 422, { error: e }));
    }
    const user = await repository.acquiredRandomString(req.body.token);
    const saltRounds: number = 12;
    const newPassword: string = req.body.password;
    const hashedPassword: string = await bcrypt.hashSync(
      newPassword,
      saltRounds
    );

    if (user && user.dataValues) {
      const userAuthDatas: any = {
        password: hashedPassword,
      };
      await repository.updateUserAuth(
        user.dataValues.employee_id,
        userAuthDatas
      );
      await repository.updateResetPassword(user.dataValues.employee_id, {
        is_use: true,
      });
    }
    return res.status(200).json(buildApiResponse(false, 200, user));
  };

  static checkUsername = async (username: any): Promise<boolean> => {
    let data = await repository.getUser(username);
    return data ? true : false;
  };

  static newRandomPassword = async (length: number): Promise<string> => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  static getUser = async (req: Request, res: Response): Promise<any> => {
    const user = await repository.getUserAuth(req.query);
    if (user.length > 0) {
      return res.status(200).json(buildApiResponse(true, 200, user));
    } else {
      return res.status(404).json(buildApiResponse(false, 404, user));
    }
  };
}
