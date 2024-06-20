import express, { Router } from "express";
import { RouterGroup } from "../utils/RouteGroup";
import { ControllerAggregator } from "../controller/ControllerAggregator";
import { ControllerMasterWilayah } from "../controller/master/ControllerMasterWilayah";
import { ControllerMasterTanggalMudik } from "../controller/master/ControllerMasterTanggalMudik";
import { ControllerMasterRute } from "../controller/master/ControllerMasterRute";
import { ValidatorMasterRute } from "../validators/master/ValidatorMasterRute";
import { ControllerMasterChildRute } from "../controller/master/ControllerMasterChildRute";
import { ValidatorMasterChildRute } from "../validators/master/ValidatorMasterChildRute";

const router: Router = express.Router();

RouterGroup.group(router, "/company", (userRouter: Router) => {
    userRouter.get("/", ControllerAggregator.getMasterCompany);
});

RouterGroup.group(router, "/unit-kerja", (userRouter: Router) => {
    userRouter.get("/", ControllerAggregator.getUnitKerja);
    
});

RouterGroup.group(router, "/tanggal", (userRouter: Router) => {
    userRouter.post("/", ControllerMasterTanggalMudik.create);
    userRouter.get("/", ControllerMasterTanggalMudik.index);
    userRouter.put("/:id", ControllerMasterTanggalMudik.update);
    userRouter.delete("/:id", ControllerMasterTanggalMudik.delete);
});

RouterGroup.group(router, "/wilayah", (userRouter: Router) => {
    userRouter.get("/provinsi", ControllerMasterWilayah.getAllProvinsi);
    userRouter.get("/kabupaten", ControllerMasterWilayah.getAllKabupaten);
    userRouter.get("/kecamatan", ControllerMasterWilayah.getAllKecamatan);
});

RouterGroup.group(router, "/rute", (userRouter: Router) => {
    userRouter.get("/", ControllerMasterRute.index);
    userRouter.post("/", ValidatorMasterRute.validate, ControllerMasterRute.create);
    userRouter.put("/:id", ControllerMasterRute.update);
    userRouter.delete("/:id", ControllerMasterRute.delete); 
});

RouterGroup.group(router, "/child-rute", (useRouter: Router) => {
    useRouter.get('/', ControllerMasterChildRute.index)
    useRouter.post('/', ValidatorMasterChildRute.validate, ControllerMasterChildRute.create)
    useRouter.put('/:id', ControllerMasterChildRute.update)
    useRouter.delete('/:id', ControllerMasterChildRute.delete)
});

export default router;