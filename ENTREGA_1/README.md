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
- **Encriptación Asíncrona**: Contraseñas hasheadas con bcrypt (no bloquea event loop)
- **Control de Roles**: Sistema de permisos (user/admin) con registro directo
- **Arquitectura MVC**: Separación clara de responsabilidades
- **Middlewares Atómicos**: Funciones específicas y reutilizables
- **Validación de Sesiones**: Endpoint `/api/sessions/current` para validar JWT
- **Protección de Rutas**: Middlewares para invitados, autenticados y roles
- **Validación Robusta**: Middlewares de validación frontend y backend
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
   - **Tipo de Cuenta**: 
     - 👤 Usuario - Acceso estándar
     - 🔧 Administrador - Acceso completo
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

| Método | Endpoint | Descripción | Middlewares | Requiere Auth |
|--------|----------|-------------|-------------|---------------|
| POST | `/api/auth/login` | Iniciar sesión | `requireGuest`, `validateLoginData` | ❌ (Solo invitados) |
| POST | `/api/auth/register` | Registrar usuario | `requireGuest`, `validateRegisterData` | ❌ (Solo invitados) |
| POST | `/api/auth/logout` | Cerrar sesión | - | ❌ |
| GET | `/api/auth/current` | Usuario actual | `requireAuth` | ✅ |
| POST | `/api/auth/refresh` | Renovar token | `requireAuth` | ✅ |

### Sesiones

| Método | Endpoint | Descripción | Middlewares | Requiere Auth |
|--------|----------|-------------|-------------|---------------|
| GET | `/api/sessions/current` | Validar sesión y obtener datos del JWT | `requireAuth` | ✅ |

### Administración

| Método | Endpoint | Descripción | Middlewares | Requiere Auth |
|--------|----------|-------------|-------------|---------------|
| GET | `/api/admin` | Panel admin | `requireAuth`, `requireRole('admin')` | ✅ (Admin) |

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
    "password": "password123",
    "role": "user"
  }'
```

#### Registro de administrador
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Admin",
    "last_name": "Sistema",
    "email": "admin@example.com",
    "age": 30,
    "password": "admin123",
    "role": "admin"
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

#### Validar sesión actual
```bash
# Verificar usuario logueado y obtener datos del JWT
curl -X GET http://localhost:3000/api/sessions/current \
  --cookie "jwt=your-jwt-token"

# O usando Authorization header
curl -X GET http://localhost:3000/api/sessions/current \
  -H "Authorization: Bearer your-jwt-token"
```

## Estructura del Proyecto

```
entrega_1/
├── src/
│   ├── config/
│   │   ├── db.config.js          # Configuración de MongoDB
│   │   └── passport.config.js    # Configuración de Passport
│   ├── controllers/              # 🆕 Controladores (Lógica de negocio)
│   │   ├── auth.controller.js    # Controlador de autenticación
│   │   └── admin.controller.js   # Controlador de administración
│   ├── middlewares/              # 🆕 Middlewares atómicos
│   │   ├── auth.middleware.js    # Middlewares de autenticación
│   │   ├── validation.middleware.js # Middleware de validación
│   │   └── error.middleware.js   # Middleware de manejo de errores
│   ├── models/
│   │   └── user.model.js         # Modelo de Usuario (bcrypt async)
│   ├── routes/
│   │   ├── routes.js             # Rutas de API (/api/auth/, /api/admin)
│   │   ├── sessions.routes.js    # 🆕 Rutas de sesiones (/api/sessions/)
│   │   └── views.routes.js       # 🆕 Rutas de vistas (páginas HTML)
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

## Arquitectura MVC

El proyecto sigue el patrón **Model-View-Controller** con separación clara de responsabilidades:

### 📁 Modelos (Models)
- **Ubicación**: `src/models/`
- **Responsabilidad**: Definición de esquemas y lógica de datos
- **Ejemplo**: `user.model.js` - Esquema de usuario con validaciones

### 🎮 Controladores (Controllers)
- **Ubicación**: `src/controllers/`
- **Responsabilidad**: Lógica de negocio y manejo de peticiones
- **Archivos**:
  - `auth.controller.js` - Login, registro, logout, etc.
  - `admin.controller.js` - Funciones administrativas

### 🛡️ Middlewares Atómicos
- **Ubicación**: `src/middlewares/`
- **Responsabilidad**: Funciones específicas y reutilizables
- **Archivos**:
  - `auth.middleware.js` - Middlewares atómicos de autenticación:
    - `requireAuth` - Verificación JWT
    - `requireRole` - Autorización por roles
    - `requireGuest` - Solo invitados
    - `optionalAuth` - Autenticación opcional
  - `validation.middleware.js` - Validación de datos de entrada
  - `error.middleware.js` - Manejo global de errores

### 🛣️ Rutas (Routes)
- **Ubicación**: `src/routes/`
- **Responsabilidad**: Definición de endpoints y aplicación de middlewares
- **Archivos**:
  - `routes.js` - Rutas de API (autenticación y admin)
  - `sessions.routes.js` - Rutas de sesiones (validación JWT)
  - `views.routes.js` - Rutas de vistas (páginas HTML)

### 🎨 Vistas (Views)
- **Ubicación**: `views/`
- **Responsabilidad**: Presentación y interfaz de usuario
- **Motor**: Handlebars para templates dinámicos

## Desarrollo

### Agregar Nuevas Funcionalidades

1. **Nuevos endpoints**: 
   - Agrega rutas en `src/routes/routes.js`
   - Crea controladores en `src/controllers/`
2. **Nuevos modelos**: Crea archivos en `src/models/`
3. **Nuevas vistas**: Agrega templates en `views/`
4. **Nuevo JavaScript**: Crea módulos en `public/js/`
5. **Validaciones**: Agrega middlewares en `src/middlewares/`

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
- **Validación Doble**: Frontend (JavaScript) y Backend (Middlewares)
- **Control de Roles**: Middleware de autorización por roles
- **Validación de Datos**: Middleware específico para cada endpoint
- **Headers**: CORS y headers de seguridad

### Validaciones Implementadas

#### Frontend (JavaScript)
- Validación en tiempo real de formularios
- Verificación de coincidencia de contraseñas
- Validación de formato de email
- Validación de edad mínima (18 años)
- Validación de roles permitidos

#### Backend (Middlewares)
- `validateRegisterData`: Validación completa de registro
- `validateLoginData`: Validación de datos de login
- `authenticateJWT`: Verificación de tokens JWT
- `authorizeRole`: Control de acceso por roles

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

## Actualizaciones Recientes

### v2.1 - Middlewares Atómicos y Optimizaciones de Rendimiento

#### 🧩 **Middlewares Atómicos Implementados**
- **Separación de responsabilidades**: Cada middleware tiene una función específica
- **`requireAuth`**: Verificación JWT y autenticación
- **`requireRole(...roles)`**: Autorización por roles específicos
- **`requireGuest`**: Protección de rutas para invitados únicamente
- **`optionalAuth`**: Autenticación opcional para comportamiento dinámico

#### 🚀 **Optimizaciones de Rendimiento**
- **bcrypt Asíncrono**: Migrado de `hashSync/compareSync` a `hash/compare`
- **Event Loop libre**: No bloquea el event loop bajo carga
- **Mejor concurrencia**: Manejo simultáneo de múltiples usuarios mejorado

#### 🔐 **Nueva Ruta de Sesiones**
- **`/api/sessions/current`**: Endpoint específico para validación de sesiones
- **Cumplimiento de requisitos**: Ruta dedicada para validar JWT y obtener datos del usuario
- **Compatibilidad mantenida**: Ruta original `/api/auth/current` sigue funcionando

#### 🏗️ **Mejoras de Arquitectura**
- **Separación de rutas**: API, sesiones y vistas en archivos independientes
- **Manejo de errores global**: Middleware centralizado para errores
- **Protección inteligente**: Rutas de login/register bloqueadas para usuarios autenticados

### v2.0 - Refactorización MVC y Mejoras de Seguridad

#### 🏗️ **Arquitectura MVC Implementada**
- **Controladores**: Lógica de negocio separada de rutas
- **Middlewares**: Validación y autenticación modularizadas
- **Separación de responsabilidades**: Código más mantenible y escalable

#### 🔧 **Nuevas Funcionalidades**
- **Registro como Admin**: Los usuarios pueden registrarse directamente como administradores
- **Validación Robusta**: Doble validación (frontend + backend)
- **Mejores Mensajes**: Feedback más detallado y claro

#### 📦 **Eliminación de Código Duplicado**
- **Utilidades JWT**: Centralizadas en `jwt.utils.js`
- **DRY Principle**: Eliminación de duplicación entre rutas y utilidades
- **Configuración Consistente**: Cookies y tokens manejados uniformemente

#### 🎯 **Beneficios Acumulados**
- ✅ **Rendimiento**: bcrypt asíncrono mejora la concurrencia
- ✅ **Seguridad**: Middlewares atómicos y validación de sesiones
- ✅ **Mantenibilidad**: Código modular y separación clara de responsabilidades
- ✅ **Escalabilidad**: Arquitectura preparada para crecimiento y alta carga
- ✅ **UX mejorada**: Protección inteligente de rutas y comportamiento dinámico



