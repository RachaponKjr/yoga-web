import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

// Routers
import authRoutes from "./routes/auth.route";
import courseRoutes from "./routes/course.route";
import bookingRoutes from "./routes/booking.route";
import webhookRouter from "./routes/webhook.route";
import paymentRoutes from "./routes/payment.route";
import adminRoutes from "./routes/admin.route";
import couponRoutes from "./routes/coupon.routes";

import path from "path";

const app = express();
const apiPrefix = "/api/v1";
const uploadPath = path.join(process.cwd(), "uploads");
// 1. Global Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
); // Security Headers
app.use(
  cors({
    origin: [
      "http://119.59.99.141:3001", // IP จริงของ Frontend
      "http://119.59.99.141:3002", // IP จริงของ Admin
      "http://localhost:3000", // เผื่อเทส Local
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json()); // Body Parser
app.use(morgan("dev")); // HTTP Request Logger
app.use(cookieParser()); // Cookie Parser

// 2. Routes
app.use(`${apiPrefix}`, routes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/course`, courseRoutes);
app.use(`${apiPrefix}/booking`, bookingRoutes);
app.use(`${apiPrefix}/payment`, paymentRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);
app.use(`${apiPrefix}/coupon`, couponRoutes);

// Webhook
app.use("/webhook", webhookRouter);

// Static Files
app.use("/uploads", express.static(uploadPath));

// 3. Error Handling (ต้องอยู่ล่างสุด)
app.use(errorHandler);

export default app;
