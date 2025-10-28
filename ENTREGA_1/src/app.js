import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import passport from './config/passport.config.js';
import authRoutes from './routes/routes.js';
import './config/db.config.js';

const app = express();

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// Configuración de Passport
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