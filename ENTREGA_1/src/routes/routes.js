import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.config.js";
import User from "../models/user.model.js";

const router = express.Router();

// JWT Secret (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Función para generar JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Middleware para verificar JWT
const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error en la autenticación' 
      });
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware para verificar roles
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }
    
    next();
  };
};

// POST /api/auth/login - Iniciar sesión
router.post('/auth/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Credenciales inválidas'
      });
    }
    
    // Generar JWT
    const token = generateToken(user);
    
    // Configurar cookie con el token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hora
    });
    
    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
      },
      token
    });
  })(req, res, next);
});

// POST /api/auth/register - Registrar usuario
router.post('/auth/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: info.message || 'Error en el registro'
      });
    }
    
    // Generar JWT
    const token = generateToken(user);
    
    // Configurar cookie con el token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hora
    });
    
    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
      },
      token
    });
  })(req, res, next);
});

// POST /api/auth/logout - Cerrar sesión
router.post('/auth/logout', (req, res) => {
  // Limpiar cookie del JWT
  res.clearCookie('jwt');
  
  res.status(200).json({
    success: true,
    message: 'Logout exitoso'
  });
});

// GET /api/auth/current - Obtener usuario actual
router.get('/auth/current', authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role
    }
  });
});

// GET /api/admin - Ruta protegida solo para administradores
router.get('/admin', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Acceso autorizado a área de administración',
    user: req.user
  });
});

// POST /api/auth/refresh - Renovar token
router.post('/auth/refresh', authenticateJWT, (req, res) => {
  // Generar nuevo token
  const newToken = generateToken(req.user);
  
  // Configurar nueva cookie
  res.cookie('jwt', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hora
  });
  
  res.status(200).json({
    success: true,
    message: 'Token renovado exitosamente',
    token: newToken
  });
});

// Middleware de manejo de errores
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

export { authenticateJWT, authorizeRole };
export default router;