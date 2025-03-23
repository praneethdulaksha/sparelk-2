import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { verifyToken } from "./middleware/authMiddleware";

dotenv.config();

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

import userRoute from "./routes/userRoute";
import itemRoute from "./routes/itemRoute";
import cartRoute from "./routes/cartRoute";
import storeRoute from "./routes/storeRoute";
import orderRoute from "./routes/orderRoute";
import { emailConfig, sendMail } from "./config/emailConfig";

const app = express();
const port: number = 3000;
const uri: string | undefined = process.env.DB_URL;

if (!uri) {
  console.error("Error: Missing DB_URL in environment variables");
  process.exit(1);
}

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    colors.yellow + req.method + "  " + colors.green + req.url + colors.reset
  );
  next();
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/images", express.static("./assets/images/"));
app.use("/sparelk/api/v1/user", userRoute);
app.use("/sparelk/api/v1/item", verifyToken, itemRoute);
app.use("/sparelk/api/v1/cart", verifyToken, cartRoute);
app.use("/sparelk/api/v1/store", storeRoute);
app.use("/sparelk/api/v1/order", verifyToken, orderRoute);

// connect db
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => console.log("Error connecting: " + err.message));

// configure email service
emailConfig();

// send test email verification mail
// sendMail({
//   to: "tgdilshanrangaka2002@gmail.com",
//   subject: "Test Email",
//   text: "This is a test email verification mail",
//   html: "<h1>This is a test email verification mail</h1><p>Click the link to verify your email: <a href='http://localhost:5173/'>Verify Email</a></p>",
// })

// start server
app.listen(port, () => console.log("Server listening on port " + port));

