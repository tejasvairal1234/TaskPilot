import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "./src/middlewares/mongoSanitizeMiddleware.js";
import rateLimit from "express-rate-limit";

import connectDB from "./src/db/connect.js";
import userRoute from "./src/routes/userRoute.js";
import taskRoute from "./src/routes/taskRoute.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ─── NoSQL Injection Sanitization ────────────────────────────────────────────
app.use(mongoSanitize);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, userRoute);
app.use("/api/tasks", taskRoute);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "TaskPilot API is running" });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Server running on http://localhost:${port}`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
