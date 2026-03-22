import express, { Router } from "express";
import {
    listLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
} from "../controllers/loanController";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.get("/", isAuthorized({ hasRole: ["officer", "manager", "admin"] }), listLoans);
router.get("/:id", isAuthorized({ hasRole: ["officer", "manager", "admin"] }), getLoanById);
router.post("/", isAuthorized({ hasRole: ["manager", "admin"] }), createLoan);
router.put("/:id", isAuthorized({ hasRole: ["manager", "admin"] }), updateLoan);
router.delete("/:id", isAuthorized({ hasRole: ["admin"] }), deleteLoan);

export default router;
