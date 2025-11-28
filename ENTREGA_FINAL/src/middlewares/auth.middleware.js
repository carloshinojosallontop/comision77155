import passport from "../config/passport.config.js";

export const requireAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error en autenticación" });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const requireRole = (roles = []) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

    next();
  };
};

export const requireGuest = (req, res, next) => {
  if (req.user) {
    return res.status(400).json({ success: false, message: "Ya estás autenticado" });
  }
  next();
};
