import passport from "../config/passport.config.js";

// Middleware para verificar JWT
export const authenticateJWT = (req, res, next) => {
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
export const authorizeRole = (roles) => {
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