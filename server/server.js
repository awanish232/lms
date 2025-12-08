import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

await connectDB();

app.use(cors());
app.use(clerkMiddleware);

// ⚠️ IMPORTANT: RAW BODY FOR WEBHOOKS
app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// NORMAL ROUTES (json allowed)
app.use(express.json());
app.use("/api/educator", educatorRouter);

app.get("/", (req, res) => res.send("API Working"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
