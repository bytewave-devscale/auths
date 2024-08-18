import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", authController.handleLogin);
authRouter.post("/authorize", authController.handleAuthorize)


export default authRouter;
