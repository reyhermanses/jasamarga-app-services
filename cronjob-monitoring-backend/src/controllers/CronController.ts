import { Request, Response } from 'express';
import moment from 'moment';

import { createApiResponse } from '../utils/Response';

import { ApproverRepository } from '../repositories/ApproverRepository';
import { OmActionRepository } from '../repositories/OmActionRepository';
import { OrgRepository } from '../repositories/OrgRepository';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { AddressRepository } from '../repositories/AddressRepository';
import { FamilyRepository } from '../repositories/FamilyRepository';
import { EducationRepository } from '../repositories/EducationRepository';
import { PersonalIDRepository } from '../repositories/PersonalIDRepository';
import { PersonalDataRepository } from '../repositories/PersonalDataRepository';
import { CronjobStatusRepository } from '../repositories/CronjobStatusRepository';
import { TaxIDRepository } from '../repositories/TaxIDRepository';
import { BPJSKesRepository } from '../repositories/BPJSKesRepository';
import { BPJSTKRepository } from '../repositories/BPJSTKRepository';

export class CronController {
  static getSummary = async (req: Request, res: Response) => {
    try {
      let dateParse: string
      dateParse = moment(Date.now()).subtract(1, "days").format('YYYYMMDD');

      // summary om_action
      const summaryOmAction = await OmActionRepository.acquireSummary(dateParse)
      // summary organization
      const summaryOrganization = await OrgRepository.acquireSummary(dateParse)
      // summary document
      const summaryDocument = await DocumentRepository.acquireSummary(dateParse)
      // summary family
      const summaryFamily = await FamilyRepository.acquireSummary(dateParse)
      // summary education
      const summaryEducation = await EducationRepository.acquireSummary(dateParse)
      // summary personal ID
      const summaryPersonalID = await PersonalIDRepository.acquireSummary(dateParse)
      // summary presonal data
      const summaryPersonalData = await PersonalDataRepository.acquireSummary(dateParse)
      // summary approver
      const approverData = await ApproverRepository.acquireSummary(dateParse)
      // summary address
      const addressData = await AddressRepository.acquireSummary(dateParse)
      // summary tax ID
      const taxIDData = await TaxIDRepository.acquireSummary(dateParse)
      // summary BPJS Kes
      const bpjsKesData = await BPJSKesRepository.acquireSummary(dateParse)
      // summary BPJS TK
      const bpjsTKData = await BPJSTKRepository.acquireSummary(dateParse)

      // for message
      const message = await CronjobStatusRepository.acquireByChangedate(dateParse)

      const summary:object = { 
        om_action: summaryOmAction, 
        document: summaryDocument,
        org: summaryOrganization,
        family: summaryFamily,
        education: summaryEducation,
        personal_id: summaryPersonalID,
        personal_data: summaryPersonalData,
        approver: approverData,
        address: addressData,
        tax_id: taxIDData,
        bpjs_kes: bpjsKesData,
        bpjs_tk: bpjsTKData
      }

      return res.status(200).send(createApiResponse(message, 200, summary))
    } catch (error) {
      console.log(error);
      return res.status(500).send(createApiResponse("failed", 500, { error }));
    }
  }
}