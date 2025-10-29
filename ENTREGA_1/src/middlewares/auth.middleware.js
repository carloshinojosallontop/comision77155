import passport from "../config/passport.config.js";

/**
 * Middleware atómico: Verifica JWT válido y agrega req.user
 * Responsabilidad única: Autenticación
 */
export const requireAuth = (req, res, next) => {
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

/**
 * Middleware atómico: Valida roles específicos
 * Responsabilidad única: Autorización por roles
 * Requiere que req.user ya esté definido (usar después de requireAuth)
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida'
      });
    }
    
    // Verificar roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Roles requeridos: ${roles.join(', ')}`
      });
    }
    
    next();
  };
};

/**
 * Middleware atómico: Bloquea acceso si ya está autenticado
 * Responsabilidad única: Proteger rutas de invitados (login/register)
 */
export const requireGuest = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // Si hay error de JWT, ignorar (puede ser token expirado/inválido)
    if (err) {
      return next(); // Permitir continuar como invitado
    }
    
    // Si hay usuario autenticado, bloquear acceso
    if (user) {
      return res.status(403).json({
        success: false,
        message: 'Ya estás autenticado. Cierra sesión primero.'
      });
    }
    
    // Si no hay usuario, permitir continuar
    next();
  })(req, res, next);
};

/**
 * Middleware opcional: Obtiene usuario si existe, pero no requiere autenticación
 * Útil para rutas que cambian comportamiento según si el usuario está logueado
 */
export const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // Ignorar errores y simplemente no agregar usuario
    if (!err && user) {
      req.user = user;
    }
    
    // Siempre continuar, sin importar el resultado
    next();
  })(req, res, next);
};

// Aliases para compatibilidad con código existente
export const authenticateJWT = requireAuth;
export const authorizeRole = requireRole;