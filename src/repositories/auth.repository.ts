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
    const deleted = await authModel.findOneAndDelete({ token });
    if (!deleted) throw new Error();

    return;
  },

  deleteMany: async (userId: string) => {
    const deleted = await authModel.deleteMany({ userId });
    return;
  },
};

export default authRepository;
