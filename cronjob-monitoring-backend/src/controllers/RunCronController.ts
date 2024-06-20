import { Request, Response } from 'express';
import moment from 'moment';

import { RunCronRepository as repository } from '../repositories/RunCronRepository';
import { createApiResponse } from '../utils/Response';

export class RunCronController {
  static payslip = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).format('YYYY-MM');

      if (typeof req.query.periode === 'string') {
        dateParse = req.query.periode as string;
      }

      const response = await repository.runPayslip( dateParse, req.query.npp )
      return res.status(200).send(createApiResponse('success', 200, response))
    } catch (error: any) {
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("NPP tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
  
  static masaKerja = async (req: Request, res: Response) => {
    try {
      const response = await repository.runMasaKerja( req.query.employee_id )
      return res.status(200).send(createApiResponse('success', 200, response.data))
    } catch (error: any) {
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("NPP tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
  
  static omAction = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runOmAction( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error: any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }

  static education = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runEducation( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }

  static leaderOrg = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runOrgLeader( dateParse, req.query.object_id )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("organisasi tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }

  static family = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runFamily( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }

  static personalData = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runPersonalData( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
  
  static personalID = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runPersonalID( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
  
  static bpjsKes = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runBpjsKes( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
  
  static bpjsTK = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runBpjsTK( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
  
  static taxId = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runTaxId( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
  
  static address = async (req: Request, res: Response) => {
    try {
      let dateParse: string = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      if (typeof req.query.changedate === 'string') {
        dateParse = req.query.changedate as string;
      }

      const response = await repository.runAddress( dateParse, req.query.personnel_number )
      const responseData:any[] = response.data
      const data = responseData.map((obj, index) => ({
        "id": index + 1,
        ...obj
      }))
      return res.status(200).send(createApiResponse('success', 200, data))
    } catch (error:any) {
      console.log(error)
      if (error.response.data.code === 404) {
        return res.status(404).send(createApiResponse("personnel number tidak ditemukan", 404, { error }));
      }
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}