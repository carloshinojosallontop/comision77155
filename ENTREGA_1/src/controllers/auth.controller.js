// controllers/auth.controller.js
import passport from "../config/passport.config.js";
import { generateToken, getCookieOptions } from "../utils/jwt.utils.js";

const pickUser = (user) => ({
  id: user._id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  age: user.age,
  role: user.role,
});

// POST /auth/login
export const login = (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || "Credenciales inválidas" });
    }

    const token = generateToken(user);
    res.cookie("jwt", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: pickUser(user),
      token, // se mantiene para no cambiar la funcionalidad
    });
  })(req, res, next);
};

// POST /auth/register
export const register = (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
    if (!user) {
      return res.status(400).json({ success: false, message: info?.message || "Error en el registro" });
    }

    const token = generateToken(user);
    res.cookie("jwt", token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: pickUser(user),
      token, // se mantiene
    });
  })(req, res, next);
};

// POST /auth/logout
export const logout = (_req, res) => {
  res.clearCookie("jwt"); // igual que el original
  return res.status(200).json({ success: true, message: "Logout exitoso" });
};

// GET /auth/current
export const getCurrentUser = (req, res) => {
  return res.status(200).json({ success: true, user: pickUser(req.user) });
};

// POST /auth/refresh
export const refreshToken = (req, res) => {
  const newToken = generateToken(req.user);
  res.cookie("jwt", newToken, getCookieOptions());
  return res.status(200).json({
    success: true,
    message: "Token renovado exitosamente",
    token: newToken, // se mantiene
  });
};
