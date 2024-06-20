import express, { Router } from "express";

import { ResetPasswordController } from "../controllers/ResetPasswordController";
import { AdminController } from "../controllers/AdminController";

import { authenticateToken } from "../middlewares/Secure";

const router: Router = express.Router();

// const router = Router();

// require("express-router-group");

router.get("/test", authenticateToken, (req, res) => {
  // console.log('test proses')
  // const user = req.user;
  // res.status(200).send(user)
});

router.post("/auth", AdminController.login);

router.post("/auth/token", AdminController.loginToken);

router.post(
  "/reset-password",
  ResetPasswordController.getUsernameResetPassword
);
router.post(
  "/send-request-change",
  ResetPasswordController.getUsernameChangePassword
);
router.post("/check-random-string", ResetPasswordController.getRandomString);
router.post("/change-password", ResetPasswordController.changePassword);
router.get("/get-users", ResetPasswordController.getUser);

export default router;
