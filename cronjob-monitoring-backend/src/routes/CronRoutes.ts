import { Router } from "express";
import { CronController } from "../controllers/CronController";
import { ApproverController } from "../controllers/ApproverController";
import { OmActionController } from "../controllers/OmActionController";
import { DocumentController } from "../controllers/DocumentController";
import { RunCronController } from "../controllers/RunCronController";
import { PersonalDataController } from "../controllers/PersonalDataController";
import { PersonalIDController } from "../controllers/PersonalIDController";
import { TaxIDController } from "../controllers/TaxIDController";
import { AddressController } from "../controllers/AddressController";
import { PendingRequestController } from "../controllers/PendingRequestConstoller";
import { EducationController } from "../controllers/EducationController";
import { FamilyController } from "../controllers/FamilyController";
import { OrgController } from "../controllers/OrgController";
import { BPJSKesController } from "../controllers/BPJSKesController";
import { BPJSTKController } from "../controllers/BPJSTKController";

const router = Router();

router.get('/summary', CronController.getSummary);

router.get('/approver', ApproverController.getByChangedate)
router.get('/om-action', OmActionController.getByChangedate)
router.get('/document', DocumentController.getByChangedate)
router.get('/personal-data', PersonalDataController.getByChangedate)
router.get('/address', AddressController.getByChangedate)
router.get('/personal-id', PersonalIDController.getByChangedate)
router.get('/tax-id', TaxIDController.getByChangedate)
router.get('/pending-request', PendingRequestController.getPendingRequest)
router.get('/education', EducationController.getByChangedate)
router.get('/family', FamilyController.getByChangedate)
router.get('/org-leader', OrgController.getAllOrg)
router.get('/bpjs-kes', BPJSKesController.getByChangedate)
router.get('/bpjs-tk', BPJSTKController.getByChangedate)

router.get('/run-om-action', RunCronController.omAction)
router.get('/run-education', RunCronController.education)
router.get('/run-family', RunCronController.family)
router.get('/run-org-leader', RunCronController.leaderOrg)
router.get('/run-profile-personal-data', RunCronController.personalData)
router.get('/run-profile-personal-id', RunCronController.personalID)
router.get('/run-profile-bpjs-kes', RunCronController.bpjsKes)
router.get('/run-profile-bpjs-tk', RunCronController.bpjsTK)
router.get('/run-profile-tax-id', RunCronController.taxId)
router.get('/run-profile-address', RunCronController.address)
router.get('/run-payslip', RunCronController.payslip)
router.get('/run-masa-kerja', RunCronController.masaKerja)

export default router;