import express from "express";
import {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import { getAdminArea } from "../controllers/admin.controller.js";
import { requireAuth, requireRole, requireGuest } from "../middlewares/auth.middleware.js";
import { validateLoginData, validateRegisterData } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/auth/login", requireGuest, validateLoginData, login);
router.post("/auth/register", requireGuest, validateRegisterData, register);
router.post("/auth/logout", logout);
router.get("/auth/current", requireAuth, getCurrentUser);
router.post("/auth/refresh", requireAuth, refreshToken);

router.get("/admin", requireAuth, requireRole("admin"), getAdminArea);

export default router;
