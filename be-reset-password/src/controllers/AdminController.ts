import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { buildApiPagination, buildApiResponse } from "../utils/Response";
import jwt from "jsonwebtoken";
import AuthValidator from "../validators/AuthValidator";
import { validate } from "class-validator";
import { ResetPasswordRepository as repository } from "../repositories/ResetPasswordRepository";

import * as dotenv from "dotenv";
import ChangePasswordValidator from "../validators/ChangePasswordValidator";
import AdminChangePasswordValidator from "../validators/AdminChangePasswordValidator";
import { newRandomPassword } from "../utils/RandomString";
import { UserRepository } from "../repositories/UserRepository";
dotenv.config();

export class AdminController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData = req.body;

      const authValidate = new AuthValidator(
        postData.username,
        postData.password
      );

      const validationErrors = await validate(authValidate);

      if (validationErrors.length > 0) {
        const e = validationErrors.map((err) => err.constraints);
        return res.status(422).json(buildApiResponse(false, 422, { error: e }));
      }

      if (postData.username === "admin-desk") {
        console.log('admin')
        return this.admin(req, res);
      }

      if (postData.username === "10691" || postData.username === "JMRBPK226") {
        return this.authAgg(req, res);
      }

      // throw new Error("Un Authenticated User");
      return res
        .status(401)
        .send(buildApiResponse(false, 401, "Un Authenticated User"));
    } catch (error: any) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static admin = async (req: Request, res: Response) => {
    const postData = req.body;

    const isSync = bcrypt.compareSync(
      postData.password,
      "$2a$04$dRHnztwuUhUjJWril5H13OhrSQk8QGe.tfzNxao6vZA7OWT538.O2"
    );

    if (isSync) {
      const payload: any = {
        v_username: postData.username,
        nama: "Adminisitrator",
        access: true,
        id: "12072023",
        role: "admin",
        unit_kerja_id: "40000071",
        isLoginToken: false,
      };

      const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
        expiresIn: "7d",
      });

      let expiresToken = "";
      jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
        async (err, decoded: any) => {
          if (err) {
            return res
              .status(403)
              .send(buildApiResponse(false, 403, "False Credential"));
          } else {
            expiresToken = decoded.exp;
          }
        }
      );

      let data: any = {
        ...payload,
        auth: { expires: expiresToken, jwt: token },
      };
      return res.status(200).send(buildApiResponse(true, 200, data));
    }

    // throw new Error("False Username or Password");
    return res
      .status(422)
      .send(buildApiResponse(false, 422, "False Username or Password"));
  };

  static authAgg = async (req: Request, res: Response) => {
    try {
      // Retrieve data from the request body or use your own data
      const postData = req.body; // Assuming your request body contains data for the POST request

      // Axios request configuration including headers
      const axiosConfig: AxiosRequestConfig = {
        method: "POST", // HTTP method (POST in this case)
        url: process.env.AGG_URL, // Replace with your API's endpoint
        headers: {
          "x-api-key": process.env.X_API_KEY, // Replace with your API key
          // password: "YOUR_PASSWORD", // Replace with your password
          "Content-Type": "application/json", // Adjust content type if needed
        },
        data: postData, // Data to be sent in the request body
        // Other request options can be added here if needed
      };

      // Create an Axios instance with custom configuration
      const instance = axios.create({
        // You can set base URL or other defaults for the instance here if needed
      });

      // Make the POST request using the custom Axios instance and configuration
      const response: any = await instance(axiosConfig);

      const payload: any = {
        v_username: response.data.data.v_username,
        nama: response.data.data.nm,
        access: true,
        id: response.data.data.id,
        role: "operator",
        unit_kerja_id: response.data.data.employee_position[0].unit_kerja_id,
        isLoginToken: false,
      };

      const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
        expiresIn: "7d",
      });

      let expiresToken = "";
      jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
        async (err, decoded: any) => {
          if (err) {
            return res
              .status(403)
              .send(buildApiResponse(false, 403, "False Credential"));
          } else {
            expiresToken = decoded.exp;
          }
        }
      );

      let data: any = {
        ...payload,
        auth: { expires: expiresToken, jwt: token },
      };

      return res.status(200).send(buildApiResponse(true, 200, data));

      // Handle the API response data
    } catch (error: any) {
      return res.status(500).send(buildApiResponse(false, 500, error));
    }
  };

  static loginToken = async (req: Request, res: Response) => {
    try {
      let dataEmployee: any = {};
      const { token } = req.body;

      jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
        (err: any, decoded: any) => {
          if (err) {
            // console.error("JWT verification failed:", err.message);
            return res
              .status(403)
              .send(buildApiResponse(false, 403, "False Credential"));
          } else {
            dataEmployee = decoded;
          }
        }
      );

      if (dataEmployee) {
        const payload: any = {
          id: dataEmployee.id,
          v_username: dataEmployee.username,
          nama: dataEmployee.nama,
          access: true,
          unit_kerja_id: dataEmployee.unit_kerja_id,
          role: "operator",
          isLoginToken: true,
        };

        const vToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
          expiresIn: "7d",
        });

        let expiresToken = "";

        jwt.verify(
          vToken,
          process.env.TOKEN_SECRET as string,
          async (err: any, decoded: any) => {
            if (err) {
              return res
                .status(403)
                .send(buildApiResponse(false, 403, "False Credential"));
            } else {
              expiresToken = decoded.exp;
            }
          }
        );

        let data: any = {
          ...payload,
          auth: { expires: expiresToken, jwt: vToken },
        };

        return res.status(200).send(buildApiResponse(true, 200, data));
      }

      return res
        .status(401)
        .send(buildApiResponse(false, 401, "Un Authenticated User"));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      const cpv = new AdminChangePasswordValidator(
        postData.password,
        postData.passwordConfirmation
      );
      const validationErrors = await validate(cpv);
      if (validationErrors.length > 0) {
        const e = validationErrors.map((err) => err.constraints);
        return res.status(422).json(buildApiResponse(false, 422, { error: e }));
      }

      const saltRounds: number = 12;
      const newPassword: string = postData.password;
      const hashedPassword: string = await bcrypt.hashSync(
        newPassword,
        saltRounds
      );

      const sendData: any = {
        password: hashedPassword,
      };

      await repository.updateUserAuth(postData.employee_id, sendData);

      return res
        .status(200)
        .json(buildApiResponse(true, 200, "Successfully update password"));
    } catch (error: any) {
      const errResponse = JSON.parse(JSON.stringify(error));
      return res.status(errResponse.status).send(errResponse.message);
    }
  };

  static resetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
      const postData: any = req.params;
      const saltRounds: number = 12;
      const newPassword: string = await newRandomPassword(12);
      const hashedPassword: string = await bcrypt.hashSync(
        newPassword,
        saltRounds
      );

      if (postData.id) {
        const userAuthDatas: any = {
          password: hashedPassword,
        };
        await repository.updateUserAuth(postData.id, userAuthDatas);
      }

      return res.status(200).send(buildApiResponse(true, 200, newPassword));
    } catch (error) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static setDefault = async (req: Request, res: Response): Promise<any> => {
    try {
      const postData: any = req.params;

      const data = await repository.getUserByEmployeeId(postData.id);

      const setDefault = data.dataValues.default_password;

      const isDefault = !setDefault;

      console.log(isDefault);

      data.default_password = isDefault;

      data.save();

      return res
        .status(200)
        .send(
          buildApiResponse(
            true,
            200,
            `Default password updated to ${isDefault}`
          )
        );
    } catch (error: any) {
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };

  static checkUsername = async (username: any): Promise<boolean> => {
    let data = await repository.getUser(username);
    return data ? true : false;
  };

  static getUserByAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
      const data = await UserRepository.acquiredUserAuth(req, res);
      return res.status(200).send(buildApiPagination(true, 200, data));
    } catch (error) {
      console.log(error);
      return res.status(500).send(buildApiResponse(false, 500, { error }));
    }
  };
}
