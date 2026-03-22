import express from "express";
import cors from "cors";
import reviewRoutes from "./routes/review.routes.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// --------------- Health Check ---------------
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// --------------- Routes ---------------
app.use("/api/review", reviewRoutes);

// --------------- 404 Handler ---------------
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found", message: "The requested route does not exist." });
});

// --------------- Global Error Handler ---------------
app.use(globalErrorHandler);

export default app;
