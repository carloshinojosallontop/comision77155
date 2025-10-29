import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model.js";

// JWT Secret (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Estrategia Local para Login
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });
    
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    
    // Verificar contraseña (asíncrono)
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Estrategia Local para Registro
passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return done(null, false, { message: 'El usuario ya existe' });
    }
    
    // Crear nuevo usuario
    const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email,
      age: req.body.age,
      password, // Se encriptará automáticamente por el middleware
      role: req.body.role || 'user'
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}));

// Estrategia JWT para proteger rutas
passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([
    // Extraer JWT desde cookies
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies.jwt;
      }
      return token;
    },
    // También extraer desde Authorization header como fallback
    ExtractJwt.fromAuthHeaderAsBearerToken()
  ]),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id).select('-password');
    
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Serialización y deserialización de usuarios para sesiones
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;