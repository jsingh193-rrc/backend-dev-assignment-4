import { Request, Response } from "express";

export const listLoans = (req: Request, res: Response): void => {
    res.json({ route: "GET /api/v1/loans" });
};

export const getLoanById = (req: Request, res: Response): void => {
    res.json({ route: "GET /api/v1/loans/:id", params: req.params });
};

export const createLoan = (req: Request, res: Response): void => {
    res.status(201).json({ route: "POST /api/v1/loans", body: req.body });
};

export const updateLoan = (req: Request, res: Response): void => {
    res.json({ route: "PUT /api/v1/loans/:id", params: req.params, body: req.body });
};

export const deleteLoan = (req: Request, res: Response): void => {
    res.json({ route: "DELETE /api/v1/loans/:id", params: req.params });
};
