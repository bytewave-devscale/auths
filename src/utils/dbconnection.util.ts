import mongoose from "mongoose";

export default function connectDb() {
  mongoose
    .connect(process.env.DB_URI as string)
    .then(() => {
      console.log("db connected");
    })
    .catch((error) => {
      console.log("db connection failed", error);
    });
}
