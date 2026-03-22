import { Request, Response, NextFunction } from "express";
import { sampleLoans } from "../../../data/sampleLoans";
import { successResponse } from "../models/responseModel";
import { NotFoundError } from "../errors/errors";

export const listLoans = (req: Request, res: Response): void => {
    res.json(successResponse(sampleLoans, "Loan applications retrieved successfully"));
};

export const getLoanById = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    const loan = sampleLoans.find((l) => l.id === id);

    if (!loan) {
        return next(new NotFoundError(`Loan application with ID ${id} not found`, "LOAN_NOT_FOUND"));
    }

    res.json(successResponse(loan, "Loan application retrieved successfully"));
};

export const createLoan = (req: Request, res: Response): void => {
    const { applicant, amount, status } = req.body;
    const newLoan = {
        id: String(sampleLoans.length + 1),
        applicant,
        amount,
        status: status || "pending",
        createdAt: new Date().toISOString(),
    };
    res.status(201).json(successResponse(newLoan, "Loan application created successfully"));
};

export const updateLoan = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    const loan = sampleLoans.find((l) => l.id === id);

    if (!loan) {
        return next(new NotFoundError(`Loan application with ID ${id} not found`, "LOAN_NOT_FOUND"));
    }

    const updated = { ...loan, ...req.body, id };
    res.json(successResponse(updated, "Loan application updated successfully"));
};

export const deleteLoan = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    const loan = sampleLoans.find((l) => l.id === id);

    if (!loan) {
        return next(new NotFoundError(`Loan application with ID ${id} not found`, "LOAN_NOT_FOUND"));
    }

    res.json(successResponse({ id }, "Loan application deleted successfully"));
};
