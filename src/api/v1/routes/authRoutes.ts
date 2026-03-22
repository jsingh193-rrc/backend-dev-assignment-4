import express, { Router } from "express";
import { signIn } from "../controllers/authController";

const router: Router = express.Router();

router.post("/signin", signIn);

export default router;
