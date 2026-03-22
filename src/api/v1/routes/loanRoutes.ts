import express, { Router } from "express";
import {
    listLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
} from "../controllers/loanController";

const router: Router = express.Router();

router.get("/", listLoans);
router.get("/:id", getLoanById);
router.post("/", createLoan);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

export default router;
