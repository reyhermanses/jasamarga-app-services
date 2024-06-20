import express, { Router } from "express";
import { RouterGroup } from "../utils/RouteGroup";
import { ControllerPic } from "../controller/ControllerPic";
import { ValidatorPic } from "../validators/ValidatorPic";
import { ValidatorRegistration } from "../validators/ValidatorRegistration";
import { ControllerRegistration } from "../controller/ControllerRegistration";
import { ValidatorRegistrationMember } from "../validators/ValidatorRegistrationMember";
import { ControllerRegistrationMember } from "../controller/ControllerRegistrationMember";
import { ControllerBus } from "../controller/ControllerBus";
import { ControllerBusMember } from "../controller/ControllerBusMember";
import { ValidatorBus } from "../validators/ValidatorBus";
import { ControllerCheckin } from "../controller/ControllerCheckin";
import { ValidatorCheckin } from "../validators/ValidatorCheckin";
import { ControllerTransaction } from "../controller/ControllerTransaction";

const router: Router = express.Router();

RouterGroup.group(router, "/pic", (useRouter: Router) => {
    useRouter.post('/', ValidatorPic.validate, ControllerPic.create)
    useRouter.get('/', ControllerPic.index)
    useRouter.put('/:id', ControllerPic.update)
    useRouter.delete('/:id', ControllerPic.delete)
});

RouterGroup.group(router, "/registration", (useRouter: Router) => {
    useRouter.post('/', ValidatorRegistration.validate, ControllerRegistration.create)
    useRouter.get('/', ControllerRegistration.index)
    useRouter.put('/:id', ControllerRegistration.update)
    useRouter.delete('/:id', ControllerRegistration.delete)
});
RouterGroup.group(router, "/registration-member", (useRouter: Router) => {
    useRouter.post('/', ValidatorRegistrationMember.validate, ControllerRegistrationMember.create)
    useRouter.get('/', ControllerRegistrationMember.index)
    useRouter.put('/:id', ControllerRegistrationMember.update)
    useRouter.delete('/:id', ControllerRegistrationMember.delete)
});
RouterGroup.group(router, "/bus", (useRouter: Router) => {
    useRouter.post('/', ValidatorBus.validate, ControllerBus.create)
    useRouter.get('/', ControllerBus.index)
    useRouter.put('/:id', ControllerBus.update)
    useRouter.delete('/:id', ControllerBus.delete)
});
RouterGroup.group(router, "/bus-member", (useRouter: Router) => {
    useRouter.get('/count', ControllerBusMember.countMember)
    useRouter.get('/', ControllerBusMember.index)
    useRouter.put('/:id', ControllerBusMember.update)
    useRouter.delete('/:id', ControllerBusMember.delete)
});
RouterGroup.group(router, "/transaction", (useRouter: Router) => {
    useRouter.post('/collection_insert',  ControllerTransaction.insert_collection)
});
RouterGroup.group(router, "/checkin", (useRouter: Router) => {
    useRouter.get('/passenger', ControllerCheckin.getAllCheckinPassengers)
    useRouter.post('/process', ValidatorCheckin.validateProcess, ControllerCheckin.checkin)
    useRouter.post('/cancel', ValidatorCheckin.validateCancel, ControllerCheckin.cancel)
});

export default router;