import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userService from "../services/user.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "s3cr3t0";

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
          return done(null, false, { message: "El correo ya está registrado" });
        }

        const { first_name, last_name, age } = req.body;
        const newUser = await userService.createUser({
          first_name,
          last_name,
          email,
          age,
          password,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await userService.findByEmail(email);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const isValid = await userService.comparePassword(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req && req.cookies) {
            return req.cookies.jwt;
          }
          if (req && req.headers && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
              return authHeader.substring(7);
            }
          }
          return null;
        },
      ]),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await userService.findById(jwtPayload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
