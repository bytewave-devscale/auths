import { Request, Response, NextFunction } from "express";

export function createAuthMiddleware(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  return async function (
    req: Request & {
      authData: { error?: string; userId?: string; accessToken?: string };
    },
    res: Response,
    next: NextFunction
  ) {
    // get accessToken and refresToken from cookies
    const { accessToken, refreshToken } = tokens;

    // fetch auth service
    const authResponse = await fetch(
      "http://auth-service-uri/api/v1/auth/authorize",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      }
    );

    const authData = await authResponse.json();

    // if authorize return error
    if ("error" in authData) {
      return res.status(401).json({ error: authData.error });
    }

    req.authData = authData;
    // here you have authData which you can access in next function

    next();
  };
}
