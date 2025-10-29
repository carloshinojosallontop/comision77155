import passport from "../config/passport.config.js";
import { generateToken, getCookieOptions } from "../utils/jwt.utils.js";

export class AuthController {
  
  // Iniciar sesión
  static async login(req, res, next) {
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
      res.cookie('jwt', token, getCookieOptions());
      
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
  }

  // Registrar usuario
  static async register(req, res, next) {
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
      res.cookie('jwt', token, getCookieOptions());
      
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
  }

  // Cerrar sesión
  static async logout(req, res) {
    // Limpiar cookie del JWT
    res.clearCookie('jwt');
    
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  }

  // Obtener usuario actual
  static async getCurrentUser(req, res) {
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
  }

  // Renovar token
  static async refreshToken(req, res) {
    // Generar nuevo token
    const newToken = generateToken(req.user);
    
    // Configurar nueva cookie
    res.cookie('jwt', newToken, getCookieOptions());
    
    res.status(200).json({
      success: true,
      message: 'Token renovado exitosamente',
      token: newToken
    });
  }
}