import express from "express";
import { getCurrentUser } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/sessions/current - Obtener el usuario actual (requiere autenticación)
router.get("/current", requireAuth, getCurrentUser);

export default router;
