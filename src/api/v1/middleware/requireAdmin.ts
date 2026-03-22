import { NextFunction, Request, Response } from "express";
import { auth } from "../../../config/firebaseConfig";
import { errorResponse } from "../models/responseModel";

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization ?? "";
        const token = header.startsWith("Bearer ") ? header.substring(7) : "";

        if (!token) {
            return res.status(401).json(errorResponse("Missing Bearer token", "auth/missing-token"));
        }

        const decodedToken = await auth.verifyIdToken(token);

        if (decodedToken.role !== "admin") {
            return res.status(403).json(errorResponse("Admin role required", "auth/insufficient-permission"));
        }

        res.locals.decodedToken = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json(errorResponse("Invalid or expired token", "auth/invalid-token"));
    }
};