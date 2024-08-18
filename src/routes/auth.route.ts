import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", authController.handleLogin);
authRouter.post("/authorize", authController.handleAuthorize);
authRouter.post("/logout/all", authController.handleLogoutAll);
authRouter.post("/logout", authController.handleLogout);
authRouter.post("/register", authController.handleRegister);

export default authRouter;
