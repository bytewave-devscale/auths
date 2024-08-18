import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/dbconnection.util";
import authRouter from "./routes/auth.route";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send("auth service - bytewaveForum");
});
// app.get("/login", (req, res) => res.send("get login"));
app.use("/api/v1/auth", authRouter);

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`server listens port:${process.env.PORT}`);
});
