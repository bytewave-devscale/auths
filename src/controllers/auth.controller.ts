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
};

export default authController;
