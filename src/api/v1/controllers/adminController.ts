import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";

const OK = 200;

export const setCustomClaims = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid, claims } = req.body;

    try {
        await auth.setCustomUserClaims(uid, claims);
        res.status(OK).json(
            successResponse({}, `Custom claims set for user: ${uid}`)
        );
    } catch (error) {
        next(error);
    }
};
