import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRepository from "../repositories/auth.repository";
import { IErrorResponse, IOneUser } from "../types/type";

const authService = {
  create: async (data: { email?: string; password?: string }) => {
    const { email, password } = data;

    // input validation
    // email & password must exist
    if (!email) throw new Error("email must be provided");
    if (!password) throw new Error("password must be provided");

    // get user from user service
    const response = await fetch(
      process.env.API_URI + "/api/v1/user/email/" + email
    );

    const responseData = (await response.json()) as IOneUser | IErrorResponse;

    // check if user exist
    if ("error" in responseData) {
      const errorResponse = responseData as IErrorResponse;
      throw new Error(errorResponse.error);
    }

    const userResponse = responseData as IOneUser;
    const { user } = userResponse;

    // check if password match
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new Error("authentication failed");

    // all validations passed
    // proceed to create access token & refresh token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_KEY as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );

    // save the refresh token in the db
    await authRepository.create({ userId: user._id, token: refreshToken });

    return { user, accessToken, refreshToken };
  },

  authorize: async (data: { accessToken: string; refreshToken: string }) => {
    const { accessToken, refreshToken } = data;

    // scenario 1: accessToken does not exist or refreshToken does not exist
    if (!accessToken || !refreshToken) throw new Error("authorization failed");

    try {
      const userDecoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_KEY as string
      );
      // scenario: accessToken valid
      return { user: userDecoded };
    } catch (error) {
      // scenario: accessToken invalid and refreshToken invalid
      const existingTokeninDb = authRepository.getOne(refreshToken);

      if (!existingTokeninDb) throw new Error("authorization failed");

      // scenario 3: accessToken invalid and refreshToken valid
      try {
        const userDecoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_KEY as string
        );
        const newAccessToken = jwt.sign(
          userDecoded,
          process.env.ACCESS_TOKEN_KEY as string
        );

        return { user: userDecoded, accessToken: newAccessToken };
      } catch (error) {
        throw new Error("authorization failed");
      }
    }
  },
};

export default authService;
