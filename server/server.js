import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import bodyParser from "body-parser";

const app = express();

// Database + Cloudinary
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Test route
app.get("/", (req, res) => res.send("API Working"));

// ❗ Clerk webhook (RAW BODY required)
app.post(
  "/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhooks
);

// Educator routes
app.use("/api/educator", educatorRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
