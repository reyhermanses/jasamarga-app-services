import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { OmActionController } from '../controllers/OmActionController';
import { cronjobStatusController } from '../controllers/CronjobStatusController';
import { ApproverController } from '../controllers/ApproverController';
import { DocumentController } from '../controllers/DocumentController';
import { OmAction319Controller } from '../controllers/OmAction319Controller';
import { EducationController } from '../controllers/EducationController';
import { FamilyController } from '../controllers/FamilyController';
import { authenticateJWT } from '../middlewares/Auth';
import { OrgController } from '../controllers/OrgController';
import { EmployeeController } from '../controllers/EmployeeController';
import { PersonalDataController } from '../controllers/PersonalDataController';
import { PersonalIDController } from '../controllers/PersonalIDController';
import { AddressController } from '../controllers/AddressController';
import { TaxIDController } from '../controllers/TaxIDController';
import { BPJSKesController } from '../controllers/BPJSKesController';
import { BPJSTKController } from '../controllers/BPJSTKController';
import { PayslipController } from '../controllers/PayslipController';

const router = Router();

router.get('/users', authenticateJWT, UserController.getAllUsers);
router.get('/users/:id', authenticateJWT, UserController.getUserById);

router.get('/om-action', authenticateJWT, OmActionController.getByParams);
router.get('/om-action-3', authenticateJWT, OmAction319Controller.getByParams);
router.get('/approver', authenticateJWT, ApproverController.getByParams);
router.get('/document', authenticateJWT, DocumentController.getByParams);
router.get('/education', authenticateJWT, EducationController.getByParams);
router.get('/family', authenticateJWT, FamilyController.getByParams);
router.get('/personal-data', authenticateJWT, PersonalDataController.getByParams);
router.get('/personal-id', authenticateJWT, PersonalIDController.getByParams);
router.get('/address', authenticateJWT, AddressController.getByParams);
router.get('/tax-id', authenticateJWT, TaxIDController.getByParams);
router.get('/bpjs-kes', authenticateJWT, BPJSKesController.getByParams);
router.get('/bpjs-tk', authenticateJWT, BPJSTKController.getByParams);
router.get('/payslip', authenticateJWT, PayslipController.getByParams);

router.get('/organization-hierarchy', authenticateJWT, OrgController.getOrgAggregator)
router.get('/organization-hierarchy/:id', authenticateJWT, OrgController.getLeader)
router.put('/organization-hierarchy/:id', authenticateJWT, OrgController.updateLeader)
router.get('/employee', authenticateJWT, EmployeeController.getEmployeeByNpp)

router.post('/report', cronjobStatusController.upsert);

export default router;
