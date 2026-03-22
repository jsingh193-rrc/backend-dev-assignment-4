import { Request, Response } from "express";

export const signIn = (req: Request, res: Response): void => {
    res.json({ route: "POST /api/v1/auth/signin", body: req.body });
};
