import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/connect.js";
import userRoute from "./src/routes/userRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoute)

const server = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log("Server is running on por ", port);
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Failed to start server...", error.message);
    process.exit(1);
  }
};

server();
