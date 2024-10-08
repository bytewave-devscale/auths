import { Request, Response } from "express";
import authService from "../services/auth.service";

const authController = {
  handleLogin: async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const token = await authService.create(data);
      return res.status(200).json(token);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
    }
  },

  handleAuthorize: async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const authenticatedUser = await authService.authorize(data);
      return res.status(200).json(authenticatedUser);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
    }
  },

  handleLogout: async (req: Request, res: Response) => {
    const data = req.body;
    try {
      await authService.logout(data);
      return res.status(200).json({ message: "logout successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  handleLogoutAll: async (req: Request, res: Response) => {
    const data = req.body;

    try {
      await authService.logoutAll(data);
      return res.status(200).json({ message: "logout all successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  },

  handleRegister: async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const newUserData = await authService.register(data);
      return res.status(201).json({ user: newUserData });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  },
};

export default authController;
