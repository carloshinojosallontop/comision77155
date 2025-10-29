import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware.js";
import { validateLoginData, validateRegisterData } from "../middlewares/validation.middleware.js";

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/auth/login', validateLoginData, AuthController.login);

// POST /api/auth/register - Registrar usuario
router.post('/auth/register', validateRegisterData, AuthController.register);

// POST /api/auth/logout - Cerrar sesión
router.post('/auth/logout', AuthController.logout);

// GET /api/auth/current - Obtener usuario actual
router.get('/auth/current', authenticateJWT, AuthController.getCurrentUser);

// GET /api/admin - Ruta protegida solo para administradores
router.get('/admin', authenticateJWT, authorizeRole(['admin']), AdminController.getAdminArea);

// POST /api/auth/refresh - Renovar token
router.post('/auth/refresh', authenticateJWT, AuthController.refreshToken);

// Middleware de manejo de errores
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

export default router;