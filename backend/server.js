import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ======================
   Routes
====================== */
import adminRoutes from "./src/routes/admin/index.js";
import adminPaymentRoutes from "./src/routes/admin/payment.routes.js";

import doctorRoutes from "./src/routes/doctor/index.js";

import centerRoutes from "./src/routes/center/index.js";
import centerAuthRoutes from "./src/routes/center/auth.routes.js";

/* ======================
   Config
====================== */
dotenv.config();

/* ======================
   App Init
====================== */
const app = express();

/* ======================
   Security & Logs
====================== */
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

/* ======================
   CORS (نهائي)
====================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://basira-frontend.vercel.app",
];

const vercelPreviewRegex = /^https:\/\/basira-frontend-.*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        vercelPreviewRegex.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ======================
   Static Files
====================== */
app.use("/uploads", express.static("uploads"));

/* ======================
   Health Check
====================== */
app.get("/", (req, res) => {
  res.send("Basira Backend Running 🚀");
});

/* ======================
   API Routes
====================== */

// Admin
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/payments", adminPaymentRoutes);

// Doctor
app.use("/api/v1/doctor", doctorRoutes);

// Center
// 🔴 auth فقط منفصل
app.use("/api/v1/center/auth", centerAuthRoutes);

// 🟢 كل باقي Routes من index.js
app.use("/api/v1/center", centerRoutes);

/* ======================
   MongoDB
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* ======================
   404 Handler (API فقط)
====================== */
app.use("/api", (req, res) => {
  res.status(404).json({
    message: `API Route not found: ${req.originalUrl}`,
  });
});

/* ======================
   Global Error Handler
====================== */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

/* ======================
   Server
====================== */
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
