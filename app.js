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

// --- FIXED GLOBAL CORS FOR VERCEL ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://hospital-management-user-sigma.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// --- Middlewares ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/temp/" }));

// --- Routes ---
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// --- DB ---
dbConnection();

export default app;


// import express from "express";
// import { config } from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";
// import { dbConnection } from "./database/dbConnection.js";
// import messageRouter from "./router/messageRouter.js";
// import { errorMiddleware } from "./middlewares/error.js";
// import userRouter from "./router/userRouter.js";
// import appointmentRouter from "./router/appointmentRouter.js";

// const app = express();
// config({ path: "./config/config.env" });

// // ----------------- CORS Setup -----------------
// const allowedOrigins = [
//   process.env.FRONTEND_URL,               // Main frontend
//   process.env.DASHBOARD_URL,              // Dashboard (future)
//   "https://hospital-management-user-sigma.vercel.app" // current production frontend
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true); // for mobile apps or curl
//     if (allowedOrigins.indexOf(origin) === -1) {
//       return callback(new Error("CORS policy: Access denied"), false);
//     }
//     return callback(null, true);
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));

// // handle preflight requests
// app.options("*", cors());

// // ----------------- Middlewares -----------------
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/temp/",
//   })
// );

// // ----------------- Routes -----------------
// app.use("/api/v1/message", messageRouter);
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/appointment", appointmentRouter);

// // ----------------- DB Connection -----------------
// dbConnection();

// // ----------------- Error Middleware -----------------
// app.use(errorMiddleware);

// export default app;
