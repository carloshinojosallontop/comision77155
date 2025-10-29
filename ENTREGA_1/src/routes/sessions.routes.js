import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/current', requireAuth, AuthController.getCurrentUser);

export default router;