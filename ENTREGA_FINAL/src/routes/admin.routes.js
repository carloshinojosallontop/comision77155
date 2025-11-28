import { Router } from "express";
import { getAdminArea } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), getAdminArea);

export default router;
