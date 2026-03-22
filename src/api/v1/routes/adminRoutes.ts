import express from "express";
import { setCustomClaims } from "../controllers/adminController";
import isAuthorized from "../middleware/authorize";

const router: express.Router = express.Router();

router.post(
	"/setCustomClaims",
	isAuthorized({ hasRole: ["admin"] }),
	setCustomClaims
);

export default router;
