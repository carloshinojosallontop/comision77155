# Entrega Final - Backend eCommerce con Repository, DTO y Recuperación de Contraseña

Proyecto de ejemplo que cumple con la consigna:

- Implementación de patrón **Repository** sobre DAOs.
- Uso de **DTOs** para no exponer información sensible del usuario (por ejemplo en `/api/auth/current`).
- Sistema de **recuperación de contraseña** con:
  - Envío de correo usando **Nodemailer**.
  - Token que expira a la hora.
  - Validación para que la nueva contraseña no sea igual a la anterior.
- Middlewares de **autorización por roles**:
  - Solo `admin` puede crear/editar/eliminar productos.
  - Solo `user` puede agregar productos al carrito y realizar la compra.
- Lógica mínima de **eCommerce** con:
  - `Product`, `Cart`, `Ticket`.
  - Compra que descuenta stock y genera un ticket.

## Requisitos

- Node.js v18 o superior
- MongoDB (local o Docker)
- Cuenta de Gmail con contraseña de aplicación (para el envío de correos)

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd ENTREGA_FINAL
```

2. Instala las dependencias:

```bash
npm install
```

3. Copia el archivo `.env.example` a `.env` y completa tus datos:

```bash
cp .env.example .env
```

4. Configura las variables de entorno en el archivo `.env`:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/entrega_final
JWT_SECRET=tu_super_clave_secreta
JWT_EXPIRES_IN=1h

MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_password_de_aplicacion
MAIL_FROM="Ecommerce Coder <tu_correo@gmail.com>"
CLIENT_URL=http://localhost:5173
```

> **Nota:** Para obtener la contraseña de aplicación de Gmail, sigue [esta guía](https://support.google.com/accounts/answer/185833).

## Iniciar MongoDB con Docker

Si usas Docker, puedes iniciar MongoDB con:

```bash
npm run start:db
```

Para detener y eliminar el contenedor:

```bash
npm run stop:db
```

## Scripts

- `npm run dev` → inicia el servidor en modo desarrollo con auto-recarga.
- `npm start` → inicia el servidor en modo producción.
- `npm run start:db` → inicia MongoDB en Docker.
- `npm run stop:db` → detiene y elimina el contenedor de MongoDB.

## Endpoints principales

### Autenticación

#### Registro de usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "123456"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```
**Respuesta:** Retorna un token JWT en una cookie `token`.

#### Usuario actual
```bash
GET /api/auth/current
Cookie: token=<jwt_token>
```
**Respuesta:** Retorna el usuario actual usando DTO (sin contraseña ni datos sensibles).

#### Logout
```bash
POST /api/auth/logout
```
**Respuesta:** Elimina la cookie del token.

#### Recuperación de contraseña
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "juan@example.com"
}
```
**Respuesta:** Envía un correo con un link que contiene un token que expira en 1 hora.

#### Resetear contraseña
```bash
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "newPassword": "nuevaContraseña123"
}
```
**Validación:** La nueva contraseña no puede ser igual a la anterior.

---

### Productos

#### Listar todos los productos
```bash
GET /api/products
```

#### Obtener un producto por ID
```bash
GET /api/products/:pid
```

#### Crear producto (solo admin)
```bash
POST /api/products
Cookie: token=<jwt_token_admin>
Content-Type: application/json

{
  "title": "Producto nuevo",
  "description": "Descripción del producto",
  "price": 1000,
  "stock": 50,
  "category": "Electrónica",
  "thumbnail": "https://ejemplo.com/imagen.jpg"
}
```

#### Actualizar producto (solo admin)
```bash
PUT /api/products/:pid
Cookie: token=<jwt_token_admin>
Content-Type: application/json

{
  "price": 1200,
  "stock": 30
}
```

#### Eliminar producto (solo admin)
```bash
DELETE /api/products/:pid
Cookie: token=<jwt_token_admin>
```

---

### Carrito

#### Obtener mi carrito (solo user)
```bash
GET /api/carts/mine
Cookie: token=<jwt_token_user>
```

#### Agregar producto al carrito (solo user)
```bash
POST /api/carts/mine/product/:pid
Cookie: token=<jwt_token_user>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Realizar compra (solo user)
```bash
POST /api/carts/mine/purchase
Cookie: token=<jwt_token_user>
```
**Lógica:**
- Verifica el stock de cada producto en el carrito.
- Descuenta el stock de los productos con disponibilidad suficiente.
- Genera un ticket con el código único, monto total y lista de productos comprados.
- Los productos sin stock suficiente permanecen en el carrito.

---

### Admin

#### Endpoint de prueba para admin
```bash
GET /api/admin
Cookie: token=<jwt_token_admin>
```
**Respuesta:** Mensaje de bienvenida solo para administradores.


---

## Modelos de Datos

### User
```javascript
{
  first_name: String,
  last_name: String,
  email: String (único),
  age: Number,
  password: String (hasheado con bcrypt),
  role: String (default: "user"), // "user" o "admin"
  cart: ObjectId (ref: "carts"),
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Product
```javascript
{
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  thumbnail: String
}
```

### Cart
```javascript
{
  products: [{
    product: ObjectId (ref: "products"),
    quantity: Number
  }]
}
```

### Ticket de compra

El modelo de **Ticket** ahora incluye también la lista de productos procesados en la compra:

```javascript
{
  code: String (único),
  purchase_datetime: Date,
  amount: Number,
  purchaser: String (email),
  products: [{
    product: ObjectId (ref: "products"),
    quantity: Number,
    price: Number
  }]
}
```

---

## Arquitectura del Proyecto

```
src/
├── app.js                    # Configuración de Express
├── server.js                 # Punto de entrada
├── config/
│   ├── db.config.js         # Conexión a MongoDB
│   └── passport.config.js   # Estrategias de autenticación
├── controllers/             # Lógica de controladores
├── daos/                    # Capa de acceso a datos (Data Access Objects)
├── dtos/                    # Objetos de transferencia de datos
├── middlewares/             # Middlewares de autenticación y manejo de errores
├── models/                  # Modelos de Mongoose
├── repositories/            # Patrón Repository sobre los DAOs
├── routes/                  # Definición de rutas
├── services/                # Lógica de negocio
└── utils/                   # Utilidades (JWT, generación de códigos)
```

---

## Roles y Permisos

| Endpoint | Admin | User |
|----------|-------|------|
| `POST /api/products` | ✅ | ❌ |
| `PUT /api/products/:pid` | ✅ | ❌ |
| `DELETE /api/products/:pid` | ✅ | ❌ |
| `GET /api/carts/mine` | ❌ | ✅ |
| `POST /api/carts/mine/product/:pid` | ❌ | ✅ |
| `POST /api/carts/mine/purchase` | ❌ | ✅ |
| `GET /api/admin` | ✅ | ❌ |

---

## Flujo de Compra

1. El usuario agrega productos a su carrito: `POST /api/carts/mine/product/:pid`
2. El usuario realiza la compra: `POST /api/carts/mine/purchase`
3. El sistema:
   - Verifica el stock de cada producto
   - Descuenta el stock de los productos disponibles
   - Genera un ticket con código único
   - Retorna el ticket y los productos que no pudieron comprarse por falta de stock

---

## Ejemplos de Uso con cURL

### 1. Registrar un usuario
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Juan","last_name":"Pérez","email":"juan@example.com","age":25,"password":"123456"}'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"juan@example.com","password":"123456"}'
```

### 3. Ver usuario actual
```bash
curl -X GET http://localhost:8080/api/auth/current \
  -b cookies.txt
```

### 4. Crear un producto (como admin)
Primero debes crear un usuario admin o cambiar el role manualmente en la base de datos.

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Laptop","description":"Laptop gaming","price":1500,"stock":10,"category":"Electrónica"}'
```

### 5. Agregar producto al carrito
```bash
curl -X POST http://localhost:8080/api/carts/mine/product/<PRODUCT_ID> \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"quantity":2}'
```

### 6. Realizar compra
```bash
curl -X POST http://localhost:8080/api/carts/mine/purchase \
  -b cookies.txt
```

---

## Notas

- Los usuarios por defecto se crean con role `"user"`.
- Para crear un admin, debes cambiar manualmente el campo `role` a `"admin"` en la base de datos.
- Los tokens JWT se almacenan en cookies HTTPOnly para mayor seguridad.
- El token de recuperación de contraseña expira en 1 hora.
- La nueva contraseña no puede ser igual a la anterior (se valida comparando el hash).

---

## Tecnologías Utilizadas

- **Node.js** + **Express** - Framework backend
- **MongoDB** + **Mongoose** - Base de datos
- **Passport.js** - Autenticación (Local + JWT)
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - Tokens JWT
- **Nodemailer** - Envío de correos
- **dotenv** - Variables de entorno

---

> **Nota:** Este proyecto es una base orientada a la consigna. Puedes integrarlo o adaptarlo a tu código original de la cursada.

