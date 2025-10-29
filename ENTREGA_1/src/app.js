import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import passport from './config/passport.config.js';
import authRoutes from './routes/routes.js';
import './config/db.config.js';

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


//routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Inicio' });
});

// Rutas de autenticación
app.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión' });
});

app.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Registrarse' });
});

// Ruta del perfil de usuario
app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Mi Perfil' });
});

// API Routes
app.use('/api', authRoutes);

export default app;