import express, { Router } from "express";
import { getUserDetails } from "../controllers/userController";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.get("/:id", isAuthorized({ hasRole: ["admin"] }), getUserDetails);

export default router;
