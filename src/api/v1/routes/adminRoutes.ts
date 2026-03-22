import express from "express";
import { setCustomClaims } from "../controllers/adminController";

const router: express.Router = express.Router();

router.post("/setCustomClaims", setCustomClaims);

export default router;
