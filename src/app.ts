import express, { Express } from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import authRoutes from "./api/v1/routes/authRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import authenticate from "./api/v1/middleware/authenticate";
import errorHandler from "./api/v1/middleware/errorHandler";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";

const app: Express = express();

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

app.use(express.json());

app.use("/api/v1/loans", authenticate, loanRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", authenticate, userRoutes);
app.use("/api/v1/admin", authenticate, adminRoutes);

app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(errorHandler);

export default app;