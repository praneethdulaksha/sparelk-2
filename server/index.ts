import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

dotenv.config();

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

// import userRoute from "./routes/userRoute";
// import itemRoute from "./routes/itemRoute";
// import cartRoute from "./routes/cartRoute";
// import storeRoute from "./routes/storeRoute";
// import orderRoute from "./routes/orderRoute";

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

app.use(cors());
app.use(express.json());

// app.use("/images", express.static("./assets/images/"));
// app.use("/api/user", userRoute);
// app.use("/item", itemRoute);
// app.use("/cart", cartRoute);
// app.use("/store", storeRoute);
// app.use("/order", orderRoute);

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => console.log("Error connecting: " + err.message));

app.listen(port, () => console.log("Server listening on port " + port));

function deleteImage(imagePath: string): void {
  const fullPath = path.join(__dirname, "assets", "images", imagePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Image ${imagePath} deleted successfully.`);
  } else {
    console.log(`Image ${imagePath} does not exist.`);
  }
}