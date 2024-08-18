import { Schema, model } from "mongoose";

const authSchema = new Schema({
  userId: String,
  token: String,
});

const authModel = model("Auth", authSchema);

const authRepository = {
  create: async (data: { userId: string; token: string }) => {
    const { userId, token } = data;

    const newAuth = new authModel({ userId, token }).save();
    return newAuth;
  },

  getOne: async (token: string) => {
    const ExistingToken = await authModel.findOne({ token });
    return ExistingToken;
  },

  deleteOne: async (token: string) => {
    await authModel.findOneAndDelete({ token });
    return;
  },

  deleteMany: async (userId: string) => {
    await authModel.deleteMany({ userId });
    return;
  },
};

export default authRepository;
