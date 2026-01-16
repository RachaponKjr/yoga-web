"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Routers
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const booking_route_1 = __importDefault(require("./routes/booking.route"));
const webhook_route_1 = __importDefault(require("./routes/webhook.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const coupon_routes_1 = __importDefault(require("./routes/coupon.routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const apiPrefix = "/api/v1";
const uploadPath = path_1.default.join(process.cwd(), "uploads");
// 1. Global Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
})); // Security Headers
app.use((0, cors_1.default)({
    origin: [
        "http://119.59.99.141:3001", // IP จริงของ Frontend
        "http://localhost:3000", // เผื่อเทส Local
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json()); // Body Parser
app.use((0, morgan_1.default)("dev")); // HTTP Request Logger
app.use((0, cookie_parser_1.default)()); // Cookie Parser
// 2. Routes
app.use(`${apiPrefix}`, routes_1.default);
app.use(`${apiPrefix}/auth`, auth_route_1.default);
app.use(`${apiPrefix}/course`, course_route_1.default);
app.use(`${apiPrefix}/booking`, booking_route_1.default);
app.use(`${apiPrefix}/payment`, payment_route_1.default);
app.use(`${apiPrefix}/admin`, admin_route_1.default);
app.use(`${apiPrefix}/coupon`, coupon_routes_1.default);
// Webhook
app.use("/webhook", webhook_route_1.default);
// Static Files
app.use("/uploads", express_1.default.static(uploadPath));
// 3. Error Handling (ต้องอยู่ล่างสุด)
app.use(error_middleware_1.errorHandler);
exports.default = app;
