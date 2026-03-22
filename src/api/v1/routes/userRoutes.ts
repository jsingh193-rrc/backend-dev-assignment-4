import express, { Router } from "express";
import { getUserDetails } from "../controllers/userController";

const router: Router = express.Router();

router.get("/:id", getUserDetails);

export default router;
