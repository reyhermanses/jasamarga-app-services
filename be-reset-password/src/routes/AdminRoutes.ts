import express, { Router } from "express";
import { RouterGroup } from "../utils/RouterGroup";

import { AdminController } from "../controllers/AdminController";
import { ResetPasswordMasterRole } from "../controllers/ResetPasswordMasterRoleController";
import { UserController } from "../controllers/UserController";
import jwt from "jsonwebtoken";

const adminRouter: Router = express.Router();

RouterGroup.group(adminRouter, "/password", (useRouter: Router) => {
  useRouter.post("/change", AdminController.changePassword);
  useRouter.put("/reset/:id", AdminController.resetPassword);
  useRouter.put("/default/:id", AdminController.setDefault);
});

RouterGroup.group(adminRouter, "/user", (userRouter: Router) => {
  userRouter.get("/", AdminController.getUserByAdmin);
});

RouterGroup.group(adminRouter, "/logout", (userRouter: Router) => {});

RouterGroup.group(adminRouter, "/management", (useRouter: Router) => {
  RouterGroup.group(useRouter, "/user", (useRouter: Router) => {
    useRouter.post("/create", UserController.create);
    useRouter.get("/read", UserController.read);
    useRouter.put("/update/:id", UserController.update);
    useRouter.delete("/delete/:id", AdminController.admin);
  });
  RouterGroup.group(useRouter, "/master-role", (useRouter: Router) => {
    useRouter.post("/create", ResetPasswordMasterRole.create);
    useRouter.get("/read", ResetPasswordMasterRole.read);
    useRouter.put("/update/:id", ResetPasswordMasterRole.update);
    useRouter.delete("/delete/:id", ResetPasswordMasterRole.delete);
  });
  RouterGroup.group(useRouter, "role", (useRouter: Router) => {
    useRouter.post("/create", AdminController.admin);
    useRouter.get("/read", AdminController.admin);
    useRouter.put("/update/:id", AdminController.changePassword);
    useRouter.delete("/delete/:id", AdminController.admin);
  });
});

export default adminRouter;
