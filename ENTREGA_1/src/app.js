
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import "./config/db.config.js";
import passport from "./config/passport.config.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/routes.js";
import sessionsRoutes from "./routes/sessions.routes.js";
import viewRoutes from "./routes/views.routes.js";


// Utilidades de ruta 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App
const app = express();

// --- Middlewares base ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// --- Static Files ---
app.use(express.static(path.join(__dirname, '../public')));

// --- Handlebars ---
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// --- Passport ---
app.use(passport.initialize());

// --- Rutas ---
app.use('/', viewRoutes);
app.use('/api', apiRoutes);
app.use('/api/sessions', sessionsRoutes);

// --- Manejo de Errores ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;