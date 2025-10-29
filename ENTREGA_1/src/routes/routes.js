import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AdminController } from "../controllers/admin.controller.js";
import { requireAuth, requireRole, requireGuest } from "../middlewares/auth.middleware.js";
import { validateLoginData, validateRegisterData } from "../middlewares/validation.middleware.js";

const router = express.Router();

// POST /api/auth/login - Iniciar sesión (solo invitados)
router.post('/auth/login', requireGuest, validateLoginData, AuthController.login);

// POST /api/auth/register - Registrar usuario (solo invitados)
router.post('/auth/register', requireGuest, validateRegisterData, AuthController.register);

// POST /api/auth/logout - Cerrar sesión (cualquiera puede llamarlo)
router.post('/auth/logout', AuthController.logout);

// GET /api/auth/current - Obtener usuario actual (requiere autenticación)
router.get('/auth/current', requireAuth, AuthController.getCurrentUser);

// GET /api/admin - Ruta protegida solo para administradores
router.get('/admin', requireAuth, requireRole('admin'), AdminController.getAdminArea);

// POST /api/auth/refresh - Renovar token (requiere autenticación)
router.post('/auth/refresh', requireAuth, AuthController.refreshToken);

export default router;