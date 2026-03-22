import express, { Express } from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";

const app: Express = express();

app.use(express.json());

app.use("/api/v1/loans", loanRoutes);

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

export default app;