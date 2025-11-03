# 🍜 My Foodie API

<p align="center">
  <img src="./src/img/logo_myfoodie.png" alt="logo_myfoodie" width="350" height="300">
</p>

API RESTful desarrollada como parte del taller **"My Foodie"**. Es una
plataforma full-stack diseñada para permitir a los usuarios registrar,
calificar y rankear restaurantes y platos.

La API gestiona usuarios, roles, autenticación, categorías,
restaurantes, platos y un sistema complejo de reseñas y calificaciones.
Incluye funcionalidades de aprobación para administradores y un sistema
de ranking ponderado basado en múltiples factores.

------------------------------------------------------------------------

## 🚀 Características Principales

-   **Gestión de Restaurantes y Platos:** Sistema completo de CRUD
    (Crear, Leer, Actualizar, Eliminar) para restaurantes y sus platos
    asociados.
-   **Sistema de Autenticación:** Registro y Login de usuarios usando
    JWT (JSON Web Tokens), passport-jwt y encriptación con bcrypt.
-   **Roles de Usuario:** Diferenciación clara entre roles de 'cliente'
    y 'admin', protegiendo endpoints críticos.
-   **Gestión de Reseñas y Ratings:** Los usuarios pueden crear, editar
    y eliminar sus propias reseñas, además de dar like o dislike a las
    reseñas de otros.
-   **Sistema de Aprobación:** Los restaurantes nuevos propuestos por
    clientes quedan en estado 'pendiente' y deben ser aprobados por un
    administrador.
-   **Ranking Ponderado:** Cálculo automático de un ranking (1-5) para
    restaurantes, basado en calificaciones, ponderación de
    likes/dislikes y antigüedad de la reseña.
-   **Transacciones MongoDB:** Uso de transacciones para operaciones
    críticas (crear reseña, votar, eliminar restaurante) para garantizar
    la consistencia de los datos.
-   **Endpoints de Perfil:** Los usuarios pueden consultar sus
    estadísticas (total reseñas, promedio) y ver un listado de todas sus
    reseñas publicadas.
-   **API Versionada:** Todos los endpoints están bajo el prefijo
    `/api/v1`.
-   **Validación de Datos:** Implementación rigurosa de DTOs en la
    carpeta `/dtos` con express-validator para asegurar la integridad de
    los datos de entrada.
-   **Seguridad:** Incluye express-rate-limit para prevenir ataques de
    fuerza bruta y cors para la conexión segura con el frontend.
-   **Documentación:** API documentada con swagger-ui-express.

------------------------------------------------------------------------

## 🧩 Tecnologías Utilizadas

-   **Node.js:** Entorno de ejecución para JavaScript.
-   **Express:** Framework para la construcción de la API REST.
-   **MongoDB:** Base de datos NoSQL (usando el driver oficial mongodb).
-   **JWT (jsonwebtoken) y Passport:** Para autenticación y estrategias
    de protección de rutas.
-   **Bcrypt:** Para encriptación de contraseñas.
-   **Dotenv:** Para la gestión segura de variables de entorno.
-   **Express-validator:** Para la validación de los datos de entrada
    (DTOs).
-   **Swagger-UI-Express:** Para la documentación interactiva de la API.
-   **Express-Rate-Limit:** Para limitar la tasa de peticiones.
-   **CORS:** Para habilitar las solicitudes de origen cruzado.
-   **Semver:** Para el versionamiento de la API.

------------------------------------------------------------------------

## ⚙️ Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1️⃣ Prerrequisitos

Asegúrate de tener instalados:

-   Node.js (v16.20.1 o superior, según package.json)
-   npm
-   MongoDB (local con replica set activado o una URI de Atlas)

### 2️⃣ Clonar el Repositorio

``` bash
git clone https://github.com/bryanvillabona/My_Foodie_Backend.git
cd My_Foodie_Backend
```

### 3️⃣ Instalar Dependencias

``` bash
npm install
```

### 4️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (puedes renombrar el
`.env.example`) y añade las siguientes variables:

``` bash
MONGO_URI=AQUI_VA_TU_MONGOURI
DB_NAME=myfoodie_db
PORT=4000
HOST_NAME=localhost
FRONTEND_URL=http://127.0.0.1:5500
JWT_SECRET=TU_CLAVE_SECRETA_PARA_JWT
```

> **Nota:** Para que las transacciones de MongoDB funcionen, debes usar
> una URI de un clúster de Atlas o tener una réplica set configurada
> localmente.

### 5️⃣ Poblar la Base de Datos (Opcional)

Para insertar datos de prueba (usuarios, admin, restaurantes, platos,
etc.) y verificar la conexión, ejecuta el script de inicialización:

``` bash
npm run seed
```

### 6️⃣ Iniciar el Servidor

Para modo desarrollo (con recarga automática):

``` bash
npm run dev
```

Para modo producción:

``` bash
npm start
```
---
# 📘 Documentación de la API (Endpoints)

Puedes ingresar a la documentación interactiva de **Swagger** en el
siguiente enlace una vez que el servidor esté corriendo:

▶️ <http://localhost:4000/api-docs>

**URL Base:** `http://localhost:4000/api/v1`

------------------------------------------------------------------------

## 👤 Módulo de Autenticación

**Rutas base:** `/api/v1/auth`

### **POST /auth/register**

**Descripción:** Registra un nuevo usuario en la plataforma con el rol
de 'cliente'.

**Request (Body):**

``` json
{
    "nombre": "Ana García",
    "email": "ana.garcia@correo.com",
    "password": "password123"
}
```

**Success Response (201 Created):**

``` json
{
    "message": "Usuario registrado exitosamente."
}
```

**Error Response (400 Bad Request):**

``` json
{
    "error": "El correo ya está registrado."
}
```

------------------------------------------------------------------------

### **POST /auth/login**

**Descripción:** Autentica a un usuario y devuelve un token JWT junto
con los datos del usuario.

**Request (Body):**

``` json
{
    "email": "ana.garcia@correo.com",
    "password": "password123"
}
```

**Success Response (200 OK):**

``` json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
        "_id": "663d5a9b8f2d1e1a3c7b8e1a",
        "nombre": "Ana García",
        "email": "ana.garcia@correo.com",
        "rol": "cliente",
        "createdAt": "2024-05-09T17:03:23.944Z"
    }
}
```

**Error Response (401 Unauthorized):**

``` json
{
    "error": "Credenciales inválidas."
}
```

------------------------------------------------------------------------

## 🧑 Módulo de Usuarios

**Rutas base:** `/api/v1/usuarios` \| **Requiere Autenticación**

### **GET /usuarios/mis-resenas**

**Descripción:** Devuelve una lista de todas las reseñas que el usuario
autenticado ha publicado, con información del restaurante.

**Success Response (200 OK):**

``` json
[
    {
        "_id": "663d5a9b8f2d1e1a3c7b8f1b",
        "restauranteId": "663d5a9b8f2d1e1a3c7b8e1a",
        "usuarioId": "663d5a9b8f2d1e1a3c7b8e1c",
        "comentario": "¡Muy bueno!",
        "calificacion": 5,
        "fecha": "2024-05-09T17:03:23.944Z",
        "likes": [],
        "dislikes": [],
        "restauranteInfo": {
            "_id": "663d5a9b8f2d1e1a3c7b8e1a",
            "nombre": "El Corral",
            "ubicacion": "Calle Falsa 123",
            "categoriaId": "663d5a9b8f2d1e1a3c7b8e1f",
            "imagenUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&h=400&fit=crop",
            "rankingPonderado": 4.5,
            "createdAt": "2024-05-09T17:03:23.944Z"
        }
    }
]
```

------------------------------------------------------------------------

### **GET /usuarios/mis-stats**

**Descripción:** Devuelve estadísticas calculadas para el usuario
autenticado (total reseñas, promedio de sus calificaciones y su
restaurante favorito).

**Success Response (200 OK):**

``` json
{
    "totalReseñas": 5,
    "promedio": "4.2",
    "favorito": "El Cielo"
}
```

------------------------------------------------------------------------

## 🏷️ Módulo de Categorías

**Rutas base:** `/api/v1/categorias`

### **GET /categorias**

**Descripción:** Obtiene la lista completa de todas las categorías
disponibles.

**Success Response (200 OK):**

``` json
[
    {
        "_id": "663d5a9b8f2d1e1a3c7b8e1f",
        "nombre": "Comida Rápida",
        "descripcion": "Restaurantes de servicio rápido",
        "createdAt": "2024-05-09T17:03:23.944Z"
    },
    {
        "_id": "663d5a9b8f2d1e1a3c7b8e2a",
        "nombre": "Gourmet",
        "descripcion": "Alta cocina",
        "createdAt": "2024-05-09T17:03:23.944Z"
    }
]
```

------------------------------------------------------------------------

### **GET /categorias/:id**

**Descripción:** Obtiene una categoría específica por su ID.

**Request (Params):** `/categorias/663d5a9b8f2d1e1a3c7b8e1f`

**Success Response (200 OK):**

``` json
{
    "_id": "663d5a9b8f2d1e1a3c7b8e1f",
    "nombre": "Comida Rápida",
    "descripcion": "Restaurantes de servicio rápido",
    "createdAt": "2024-05-09T17:03:23.944Z"
}
```

------------------------------------------------------------------------

### **POST /categorias**

**Descripción:** Crea una nueva categoría. *(Rol Admin Requerido).*

**Request (Body):**

``` json
{
    "nombre": "Vegetariana",
    "descripcion": "Comida sin carne"
}
```

**Success Response (201 Created):**

``` json
{
    "message": "Categoría creada correctamente.",
    "categoria": {
        "nombre": "Vegetariana",
        "descripcion": "Comida sin carne",
        "createdAt": "2024-05-10T14:00:00.000Z",
        "_id": "663d5a9b8f2d1e1a3c7b8e3b"
    }
}
```

------------------------------------------------------------------------

### **PATCH /categorias/:id**

**Descripción:** Actualiza una categoría existente. *(Rol Admin
Requerido).*

**Request (Params & Body):** `/categorias/663d5a9b8f2d1e1a3c7b8e3b`

``` json
{
    "nombre": "Vegana",
    "descripcion": "Comida 100% basada en plantas"
}
```

**Success Response (200 OK):**

``` json
{
    "message": "Categoría actualizada."
}
```

------------------------------------------------------------------------

### **DELETE /categorias/:id**

**Descripción:** Elimina una categoría. Falla si la categoría está en
uso por algún restaurante. *(Rol Admin Requerido).*

**Request (Params):** `/categorias/663d5a9b8f2d1e1a3c7b8e3b`

**Success Response (200 OK):**

``` json
{
    "message": "Categoría eliminada."
}
```

**Error Response (400 Bad Request):**

``` json
{
    "error": "No se puede eliminar la categoría, está siendo utilizada por uno o más restaurantes."
}
```
# 🍽️ Módulo de Restaurantes
**Rutas base:** `/api/v1/restaurantes`

---

## **GET /restaurantes**
**Descripción:** Obtiene la lista de restaurantes aprobados.  
Permite filtrar por categoría (ID) y ordenar por `sort` (ranking, popularidad, recientes).  

**Request (Query Params):**
```
/restaurantes?categoria=663d5a9b8f2d1e1a3c7b8e1f&sort=popularidad
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "663d5a9b8f2d1e1a3c7b8e1a",
    "nombre": "El Corral",
    "descripcion": "Hamburguesas premium",
    "ubicacion": "Calle Falsa 123",
    "imagenUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&h=400&fit=crop",
    "estado": "aprobado",
    "rankingPonderado": 4.5,
    "createdAt": "2024-05-09T17:03:23.944Z",
    "categoriaId": "663d5a9b8f2d1e1a3c7b8e1f",
    "totalReseñas": 12,
    "categoriaInfo": {
      "_id": "663d5a9b8f2d1e1a3c7b8e1f",
      "nombre": "Comida Rápida"
    }
  }
]
```

---

## **GET /restaurantes/:id**
**Descripción:** Obtiene la información detallada de un restaurante (aprobado), incluyendo sus platos y la información de su categoría.  

**Request (Params):**
```
/restaurantes/663d5a9b8f2d1e1a3c7b8e1a
```

**Success Response (200 OK):**
```json
{
  "_id": "663d5a9b8f2d1e1a3c7b8e1a",
  "nombre": "El Corral",
  "categoriaInfo": {
    "_id": "663d5a9b8f2d1e1a3c7b8e1f",
    "nombre": "Comida Rápida"
  },
  "platos": [
    {
      "_id": "663d5a9b8f2d1e1a3c7b8e4c",
      "restauranteId": "663d5a9b8f2d1e1a3c7b8e1a",
      "nombre": "Hamburguesa Todoterreno",
      "precio": 25000
    }
  ]
}
```

---

## **POST /restaurantes**
**Descripción:** Un usuario autenticado propone un nuevo restaurante. Queda en estado `pendiente`. (Autenticación Requerida).  

**Request (Body):**
```json
{
  "nombre": "Restaurante Nuevo",
  "descripcion": "Prueba de restaurante",
  "ubicacion": "Avenida Siempre Viva",
  "categoriaId": "663d5a9b8f2d1e1a3c7b8e1f",
  "imagenUrl": "https://ejemplo.com/foto.png"
}
```

**Success Response (201 Created):**
```json
{
  "message": "Restaurante propuesto. Pendiente de aprobación.",
  "restaurante": {
    "estado": "pendiente"
  }
}
```

---

## **GET /restaurantes/admin/pendientes**
**Descripción:** Obtiene la lista de restaurantes pendientes de aprobación. (Rol Admin Requerido).  
**Request:** No requiere body.  

**Success Response (200 OK):** Lista de restaurantes con estado `"pendiente"`.

---

## **PATCH /restaurantes/:id/aprobar**
**Descripción:** Aprueba un restaurante pendiente. (Rol Admin Requerido).  

**Request (Params):**
```
/restaurantes/663d5a9b8f2d1e1a3c7b8e5d/aprobar
```

**Success Response (200 OK):**
```json
{
  "message": "Restaurante aprobado."
}
```

---

## **PATCH /restaurantes/:id**
**Descripción:** Actualiza la información de un restaurante. (Rol Admin Requerido).  

**Request (Params & Body):**
```json
{
  "nombre": "El Corral (Editado)",
  "ubicacion": "Nueva Dirección 456"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Restaurante actualizado."
}
```

---

## **DELETE /restaurantes/:id**
**Descripción:** Elimina un restaurante y todos sus datos asociados. (Rol Admin Requerido).  

**Request (Params):**
```
/restaurantes/663d5a9b8f2d1e1a3c7b8e1a
```

**Success Response (200 OK):**
```json
{
  "message": "Restaurante y todos sus datos asociados fueron eliminados."
}
```

---

# 🍛 Módulo de Platos
**Rutas base:** `/api/v1/restaurantes/:id/platos` y `/api/v1/platos/:id`

---

## **GET /restaurantes/:id/platos**
**Descripción:** Obtiene la lista de platos de un restaurante específico.  

**Request (Params):**
```
/restaurantes/663d5a9b8f2d1e1a3c7b8e1a/platos
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "663d5a9b8f2d1e1a3c7b8e4c",
    "restauranteId": "663d5a9b8f2d1e1a3c7b8e1a",
    "nombre": "Hamburguesa Todoterreno",
    "descripcion": "Doble carne, queso y tocineta",
    "precio": 25000,
    "imagenUrl": "https://ejemplo.com/hamburguesa.png",
    "createdAt": "2024-05-09T17:03:23.944Z"
  }
]
```

---

## **POST /restaurantes/:id/platos**
**Descripción:** Crea un nuevo plato y lo asocia al restaurante. (Rol Admin Requerido).  

**Request (Params & Body):**
```json
{
  "nombre": "Malteada de Oreo",
  "descripcion": "Malteada clásica",
  "precio": 12000
}
```

**Success Response (201 Created):**
```json
{
  "message": "Plato creado correctamente.",
  "plato": {}
}
```

---

## **PATCH /platos/:id**
**Descripción:** Actualiza la información de un plato. (Rol Admin Requerido).  

**Request (Params & Body):**
```json
{
  "precio": 26000
}
```

**Success Response (200 OK):**
```json
{
  "message": "Plato actualizado."
}
```

---

## **DELETE /platos/:id**
**Descripción:** Elimina un plato específico. (Rol Admin Requerido).  

**Request (Params):**
```
/platos/663d5a9b8f2d1e1a3c7b8e4c
```

**Success Response (200 OK):**
```json
{
  "message": "Plato eliminado."
}
```
# ⭐ Módulo de Reseñas
**Rutas base:** `/api/v1/restaurantes/:id/resenas` y `/api/v1/resenas/:id`

---

## **GET /restaurantes/:id/resenas**
**Descripción:** Obtiene todas las reseñas de un restaurante específico, incluyendo la información del usuario que la escribió.  

**Request (Params):**
```
/restaurantes/663d5a9b8f2d1e1a3c7b8e1a/resenas
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "663d5a9b8f2d1e1a3c7b8f1b",
    "restauranteId": "663d5a9b8f2d1e1a3c7b8e1a",
    "usuarioId": "663d5a9b8f2d1e1a3c7b8e1c",
    "comentario": "¡Muy bueno!",
    "calificacion": 5,
    "fecha": "2024-05-09T17:03:23.944Z",
    "likes": ["663d5a9b8f2d1e1a3c7b8e1d"],
    "dislikes": [],
    "usuarioInfo": {
      "_id": "663d5a9b8f2d1e1a3c7b8e1c",
      "nombre": "Carlos Lopez"
    }
  }
]
```

---

## **POST /restaurantes/:id/resenas**
**Descripción:** Crea una nueva reseña para un restaurante.  
El usuario solo puede crear una reseña por restaurante.  
Esta acción recalcula el ranking del restaurante (Transaccional).  
(Autenticación Requerida).  

**Request (Params & Body):**
```
/restaurantes/663d5a9b8f2d1e1a3c7b8e1a/resenas
```
```json
{
  "comentario": "El servicio fue un poco lento.",
  "calificacion": 3
}
```

**Success Response (201 Created):**
```json
{
  "message": "Reseña creada con éxito.",
  "reseñaId": "663d5a9b8f2d1e1a3c7b8f2c"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Ya has enviado una reseña para este restaurante."
}
```

---

## **PATCH /resenas/:id**
**Descripción:** Actualiza una reseña existente.  
Solo el autor original puede editarla.  
Recalcula el ranking (Transaccional).  
(Autenticación Requerida).  

**Request (Params & Body):**
```
/resenas/663d5a9b8f2d1e1a3c7b8f2c
```
```json
{
  "comentario": "El servicio mejoró.",
  "calificacion": 4
}
```

**Success Response (200 OK):**
```json
{
  "message": "Reseña actualizada."
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "No autorizado para editar esta reseña."
}
```

---

## **DELETE /resenas/:id**
**Descripción:** Elimina una reseña.  
Solo el autor original puede eliminarla.  
Recalcula el ranking (Transaccional).  
(Autenticación Requerida).  

**Request (Params):**
```
/resenas/663d5a9b8f2d1e1a3c7b8f2c
```

**Success Response (200 OK):**
```json
{
  "message": "Reseña eliminada."
}
```

---

## **POST /resenas/:id/like**
**Descripción:** Da 'Like' a una reseña.  
Un usuario no puede votar su propia reseña.  
Recalcula el ranking (Transaccional).  
(Autenticación Requerida).  

**Request (Params):**
```
/resenas/663d5a9b8f2d1e1a3c7b8f1b/like
```

**Success Response (200 OK):**
```json
{
  "message": "Voto de 'like' registrado."
}
```

---

## **POST /resenas/:id/dislike**
**Descripción:** Da 'Dislike' a una reseña.  
Un usuario no puede votar su propia reseña.  
Recalcula el ranking (Transaccional).  
(Autenticación Requerida).  

**Request (Params):**
```
/resenas/663d5a9b8f2d1e1a3c7b8f1b/dislike
```

**Success Response (200 OK):**
```json
{
  "message": "Voto de 'dislike' registrado."
}
```

---
# 📚 Documentación
A continuación se presenta la documentación pertinente acerca de este proyecto:
1. [Documentación My Foodie](https://drive.google.com/file/d/1Cfc62Wa4C-18MxyGDZE945p-1gNmbw1W/view?usp=sharing)
2. [Manual de usuario My Foodie](https://drive.google.com/file/d/1-Fiiikn1asZVWeYhBTTPTOBUfFqM_O1q/view?usp=sharing)
3. [Especificación de requisitos de Software](https://drive.google.com/file/d/1vdKAKPV3AWIox3Z8Nyocg6T4kWTtndud/view?usp=sharing)
---
# 🔗 Repositorio del Frontend
El frontend de esta aplicación, desarrollado con **HTML**, **CSS** y **JavaScript puro**, se encuentra en un repositorio separado:

[▶️ **Ver Repositorio del Frontend**](https://github.com/sergiosteven66/My_Foodie_Frontend.git)

---

# 🎥 Video Demostrativo
En el siguiente video se explica el código y se muestra el funcionamiento completo de la aplicación, tanto del backend como del frontend.

[▶️ **Ver Video explicativo**](https://drive.google.com/file/d/1JgWmRrLd71fPnHI7gWLLWWk49IZtGPge/view?usp=sharing)

---

# 👥 Integrantes
| Nombre Completo | Rol |
|------------------|------|
| Bryan Villabona | Estudiante |
| Sergio Lievano   | Estudiante |
