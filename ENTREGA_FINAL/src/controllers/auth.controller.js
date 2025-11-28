import passport from "../config/passport.config.js";
import { generateToken, getCookieOptions } from "../utils/jwt.utils.js";
import { toUserDTO } from "../dtos/user.dto.js";
import userService from "../services/user.service.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export const register = (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ success: false, message: info?.message || "Error en el registro" });
    }

    const token = generateToken(user);
    res.cookie("jwt", token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      user: toUserDTO(user),
      token,
    });
  })(req, res, next);
};

export const login = (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ success: false, message: info?.message || "Credenciales inválidas" });
    }

    const token = generateToken(user);
    res.cookie("jwt", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: toUserDTO(user),
      token,
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Sesión cerrada" });
};

export const current = (req, res) => {
  return res.status(200).json({
    success: true,
    user: toUserDTO(req.user),
  });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const baseUrl = process.env.API_BASE_URL || "http://localhost:8080/api";
    await userService.startPasswordReset(email, baseUrl);
    res.status(200).json({
      success: true,
      message: "Si el correo existe, se ha enviado un enlace de recuperación",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await userService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: "Contraseña restablecida correctamente",
    });
  } catch (err) {
    next(err);
  }
};
