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
      // do something if error/authorization fail
    }

    // here you have authData containing userId, or userId and new accessToken if accessToken used before is invalid but the refreshToken valid

    // do something ...

    next();
  };
}
