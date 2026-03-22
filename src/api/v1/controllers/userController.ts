import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";

const OK = 200;

export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params;

    try {
        const user: UserRecord = await auth.getUser(id);
        res.status(OK).json(successResponse(user));
    } catch (error) {
        next(error);
    }
};
