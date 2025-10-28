# Sistema de Autenticación JWT con Node.js

Un sistema de autenticación completo construido con Node.js, Express, MongoDB y JWT (JSON Web Tokens). Incluye registro de usuarios, login, gestión de perfiles y control de acceso basado en roles.

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## Características

- **Autenticación JWT**: Sistema seguro de tokens
- **Gestión de Usuarios**: Registro, login y perfiles
- **Encriptación**: Contraseñas hasheadas con bcrypt
- **Control de Roles**: Sistema de permisos (user/admin)
- **Cookies Seguras**: JWT almacenado en cookies httpOnly
- **Responsive**: Interfaz adaptativa con Bootstrap 5
- **UI Modular**: JavaScript organizado y modular
- **Estados de Carga**: Feedback visual en operaciones
- **Tiempo Real**: Actualización automática de navegación

## Tecnologías

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - JSON Web Tokens para autenticación
- **bcrypt** - Encriptación de contraseñas
- **Passport.js** - Middleware de autenticación
- **Cookie Parser** - Manejo de cookies

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos
- **JavaScript ES6+** - Lógica del cliente
- **Bootstrap 5** - Framework CSS
- **Handlebars** - Motor de plantillas
- **FontAwesome** - Iconos

### DevOps
- **Docker** - Contenedorización de MongoDB
- **npm** - Gestor de paquetes

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Docker** (para la base de datos MongoDB)
- **Git** (opcional, para clonar el repositorio)

### Verificar instalaciones:
```bash
node --version
npm --version
docker --version
```

## Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd entrega_1
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar MongoDB con Docker
```bash
npm run start:db
```

### 4. Iniciar el servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

### 5. Abrir en el navegador
```
http://localhost:3000
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# Base de datos
MONGODB_URI=mongodb://localhost:27017/db_entrega1

# JWT Configuration
JWT_SECRET=tu-super-secreto-jwt-key
JWT_EXPIRES_IN=1h

# Entorno
NODE_ENV=development
```

### Configuración de MongoDB

El proyecto usa Docker para MongoDB. Los comandos disponibles son:

```bash
# Iniciar contenedor de MongoDB
npm run start:db

# Detener y remover contenedor
npm run stop:db
```

## Uso

### Registro de Usuario

1. Navega a `/register`
2. Completa el formulario con:
   - Nombre y apellido
   - Email (único)
   - Edad (mínimo 18 años)
   - Contraseña (mínimo 6 caracteres)
3. Confirma la contraseña
4. Serás redirigido automáticamente al perfil

### Iniciar Sesión

1. Navega a `/login`
2. Ingresa tu email y contraseña
3. Serás redirigido al perfil tras un login exitoso

### Navegación

- **Usuarios no autenticados**: Ven opciones de login/registro
- **Usuarios autenticados**: Ven su nombre y opciones de perfil/logout
- **Administradores**: Acceso adicional a funciones admin

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| POST | `/api/auth/register` | Registrar usuario | ❌ |
| POST | `/api/auth/logout` | Cerrar sesión | ❌ |
| GET | `/api/auth/current` | Usuario actual | ✅ |
| POST | `/api/auth/refresh` | Renovar token | ✅ |

### Administración

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| GET | `/api/admin` | Panel admin | ✅ (Admin) |

### Ejemplos de Uso

#### Registro de usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

## Estructura del Proyecto

```
entrega_1/
├── src/
│   ├── config/
│   │   ├── db.config.js          # Configuración de MongoDB
│   │   └── passport.config.js    # Configuración de Passport
│   ├── models/
│   │   └── user.model.js         # Modelo de Usuario
│   ├── routes/
│   │   └── routes.js             # Rutas de API
│   ├── utils/
│   │   └── jwt.utils.js          # Utilidades JWT
│   ├── app.js                    # Configuración Express
│   └── server.js                 # Punto de entrada
├── views/
│   ├── layouts/
│   │   └── main.handlebars       # Layout principal
│   ├── auth/
│   │   ├── login.handlebars      # Vista de login
│   │   └── register.handlebars   # Vista de registro
│   ├── home.handlebars           # Página de inicio
│   └── profile.handlebars        # Perfil de usuario
├── public/
│   └── js/
│       ├── app.js                # Configuración principal
│       ├── api-utils.js          # Utilidades de API
│       ├── ui-utils.js           # Utilidades de UI
│       ├── auth.js               # Gestión de autenticación
│       ├── login.js              # Lógica de login
│       ├── register.js           # Lógica de registro
│       ├── home.js               # Lógica de inicio
│       └── profile.js            # Lógica de perfil
├── package.json
├── .gitignore
└── README.md
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con auto-reload
npm start           # Inicia servidor en modo producción

# Base de datos
npm run start:db    # Inicia contenedor MongoDB
npm run stop:db     # Detiene y elimina contenedor MongoDB

# Utilidades
npm install         # Instala dependencias
```

## Desarrollo

### Agregar Nuevas Funcionalidades

1. **Nuevos endpoints**: Agrega rutas en `src/routes/routes.js`
2. **Nuevos modelos**: Crea archivos en `src/models/`
3. **Nuevas vistas**: Agrega templates en `views/`
4. **Nuevo JavaScript**: Crea módulos en `public/js/`

### Debugging

La aplicación incluye logging y manejo de errores:

```javascript
// Acceder a utilidades de debug
App.debug.getCurrentUser()    // Ver usuario actual
App.debug.forceLogout()       // Forzar logout
App.debug.clearStorage()      // Limpiar storage
```

## Seguridad

- **Contraseñas**: Hasheadas con bcrypt (10 salt rounds)
- **JWT**: Almacenado en cookies httpOnly
- **Cookies**: Configuradas con sameSite y secure
- **Validación**: Frontend y backend
- **Headers**: CORS y headers de seguridad

## Despliegue

### Producción

1. Configura variables de entorno de producción
2. Usa una base de datos MongoDB externa
3. Configura HTTPS para cookies seguras
4. Usa un proxy reverso (nginx)

```bash
# Variables de entorno para producción
NODE_ENV=production
MONGODB_URI=mongodb://tu-mongo-uri
JWT_SECRET=tu-secreto-super-seguro
```



