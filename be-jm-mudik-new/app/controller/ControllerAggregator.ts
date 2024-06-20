import { NextFunction, Request, Response } from "express";
import axios, { AxiosRequestConfig } from "axios";
import { ResponseData } from "../types/data";
import * as dotenv from "dotenv";
dotenv.config();

export class ControllerAggregator {
    static async getMasterCompany(req: Request, res:Response) {
        // Define the URL of the endpoint you want to access
        const url:any = `${process.env.AGG_URL}/api/v1/master/company`;

        // Define the headers object with key-value pairs
        const headers = {
        'x-api-key': process.env.X_API_KEY,  // Replace with your actual token
        'Content-Type': 'application/json'  // Example header, adjust as needed
        };

        // Make the GET request with Axios
        const response:any = await axios.get(url, { headers });

        if( response.status as number !== 200){
            res.status(500).json(`Can\`t retrieve data`)
        }

        res.status(200).json(response.data)
    }

    static async getUnitKerja( req: Request, res: Response){
        // Define the URL of the endpoint you want to access
        const url:any = `${process.env.AGG_URL}/api/v1/employee/organization-unit?relation=unit_kerja`;

        // Define the headers object with key-value pairs
        const headers = {
        'x-api-key': process.env.X_API_KEY,  // Replace with your actual token
        'Content-Type': 'application/json'  // Example header, adjust as needed
        };

        // Make the GET request with Axios
        const response:any = await axios.get(url, { headers });

        if( response.status as number !== 200){
            res.status(500).json(`Can\`t retrieve data`)
        }

        res.status(200).json(response.data) 
    }
}