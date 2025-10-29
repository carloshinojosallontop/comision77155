import express from "express";
import { requireAuth, requireGuest, optionalAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ruta principal - Página de inicio (comportamiento dinásico según autenticación)
router.get('/', optionalAuth, (req, res) => {
    res.render('home', { 
        title: 'Inicio',
        user: req.user // Pasamos el usuario si existe
    });
});

// Rutas de autenticación - Solo para invitados
router.get('/login', requireGuest, (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión' });
});

router.get('/register', requireGuest, (req, res) => {
    res.render('auth/register', { title: 'Registrarse' });
});

// Ruta del perfil - Solo para usuarios autenticados
router.get('/profile', requireAuth, (req, res) => {
    res.render('profile', { 
        title: 'Mi Perfil',
        user: req.user
    });
});

export default router;