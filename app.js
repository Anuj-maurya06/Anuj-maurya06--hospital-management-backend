import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();
config({ path: "./config/config.env" });

// --- CORS: allow origins from env (comma-separated) and enable credentials ---
app.use((req, res, next) => {
  // FRONTEND_URL and DASHBOARD_URL can be single origin or comma-separated lists
  // Combine both env vars so both frontend and dashboard origins are accepted.
  const rawParts = [];
  if (process.env.FRONTEND_URL) rawParts.push(process.env.FRONTEND_URL);
  if (process.env.DASHBOARD_URL) rawParts.push(process.env.DASHBOARD_URL);
  const raw = rawParts.join(",");
  const allowed = raw
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, "")) // remove trailing slashes
    .filter(Boolean);

  const origin = req.headers.origin;
  const originNormalized = origin ? origin.replace(/\/+$/, "") : "";

  // If the incoming Origin is in the allowed list, echo the actual Origin back.
  if (origin && allowed.includes(originNormalized)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (allowed.length === 1) {
    // Single configured frontend: use that (use the exact configured value)
    res.header("Access-Control-Allow-Origin", allowed[0]);
  } else {
    // Fallback: if no allowed origin configured, echo incoming origin to support testing.
    if (origin) res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// --- Body parsing (Vercel safe) ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- Middlewares ---
app.use(cookieParser());
app.set("trust proxy", 1);
// --- File upload (Vercel safe) ---
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",  // Vercel serverless friendly temp dir
    createParentPath: true,
  })
);

// --- Routes ---
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// --- Root route (for test) ---
app.get("/", (req, res) => {
  res.send("Backend is running on Vercel!");
});

// --- DB Connection ---
dbConnection();

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;


 