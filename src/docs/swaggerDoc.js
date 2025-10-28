import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '..', '..', 'package.json');

const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonContent);

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "My Foodie API",
    version: packageJson.version, 
    description: "API para calificar y rankear restaurantes y platos."
  },
  servers: [
    {
      url: `http://${process.env.HOST_NAME || 'localhost'}:${process.env.PORT || 4000}/api/v1`,
      description: "Servidor local de desarrollo"
    }
  ],
  
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token de autenticación JWT (Bearer). Ingresa 'Bearer' [espacio] y luego tu token."
      }
    },
    schemas: {
      UsuarioPublico: {
        type: "object",
        properties: {
          _id: { type: "string", example: "663d5a9b8f2d1e1a3c7b8e1a" },
          nombre: { type: "string", example: "Carlos Lopez" },
          email: { type: "string", example: "carlos@correo.com" },
          rol: { type: "string", example: "cliente" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..."},
          usuario: { "$ref": "#/components/schemas/UsuarioPublico" }
        }
      },
      RegistroInput: {
        type: "object",
        required: ["nombre", "email", "password"],
        properties: {
          nombre: { type: "string", example: "Carlos Lopez" },
          email: { type: "string", example: "carlos@correo.com" },
          password: { type: "string", example: "password123" }
        }
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "carlos@correo.com" },
          password: { type: "string", example: "password123" }
        }
      },

      Categoria: {
        type: "object",
        properties: {
          _id: { type: "string", example: "663d5a9b8f2d1e1a3c7b8e1a" },
          nombre: { type: "string", example: "Comida rápida" },
          descripcion: { type: "string", example: "Restaurantes de servicio rápido" }
        }
      },
      CategoriaInput: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", example: "Comida rápida" },
          descripcion: { type: "string", example: "Restaurantes de servicio rápido" }
        }
      },

      RestauranteInput: {
        type: "object",
        required: ["nombre", "descripcion", "ubicacion", "categoriaId"],
        properties: {
          nombre: { type: "string", example: "El Corral" },
          descripcion: { type: "string", example: "Hamburguesas premium" },
          ubicacion: { type: "string", example: "Calle Falsa 123" },
          categoriaId: { type: "string", example: "663d5a9b8f2d1e1a3c7b8e1a" },
          imagenUrl: { type: "string", example: "https://ejemplo.com/imagen.png" }
        }
      },
      RestauranteUpdateInput: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          ubicacion: { type: "string" },
          categoriaId: { type: "string" },
          imagenUrl: { type: "string" },
          estado: { type: "string", enum: ["pendiente", "aprobado"] }
        }
      },

      PlatoInput: {
        type: "object",
        required: ["nombre", "descripcion", "precio"],
        properties: {
          nombre: { type: "string", example: "Hamburguesa Todoterreno" },
          descripcion: { type: "string", example: "Doble carne, queso y tocineta" },
          precio: { type: "number", example: 25000 },
          imagenUrl: { type: "string", example: "https://ejemplo.com/hamburguesa.png" }
        }
      },
      PlatoUpdateInput: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          precio: { type: "number" },
          imagenUrl: { type: "string" }
        }
      },

      ReseñaInput: {
        type: "object",
        required: ["comentario", "calificacion"],
        properties: {
          comentario: { type: "string", example: "¡Muy bueno, pero lento el servicio!" },
          calificacion: { type: "integer", example: 4, minimum: 1, maximum: 5 }
        }
      },
      ReseñaUpdateInput: {
        type: "object",
        properties: {
          comentario: { type: "string" },
          calificacion: { type: "integer", minimum: 1, maximum: 5 }
        }
      },
      
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Mensaje de error descriptivo." }
        }
      }
    }
  },

  paths: {
    "/auth/register": {
      post: {
        tags: ["Autenticación"],
        summary: "Registrar un nuevo usuario",
        security: [], 
        requestBody: {
          required: true,
          content: { "application/json": { schema: { "$ref": "#/components/schemas/RegistroInput" } } }
        },
        responses: {
          "201": { description: "Usuario registrado." },
          "400": { description: "Datos inválidos (ej. email duplicado)." }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Autenticación"],
        summary: "Iniciar sesión",
        security: [], 
        requestBody: {
          required: true,
          content: { "application/json": { schema: { "$ref": "#/components/schemas/LoginInput" } } }
        },
        responses: {
          "200": {
            description: "Login exitoso.",
            content: { "application/json": { schema: { "$ref": "#/components/schemas/LoginResponse" } } }
          },
          "401": { description: "Credenciales inválidas." }
        }
      }
    },
    
    "/categorias": {
      get: {
        tags: ["Categorías"],
        summary: "Obtener todas las categorías",
        security: [],
        responses: {
          "200": { description: "Lista de categorías." }
        }
      },
      post: {
        tags: ["Categorías"],
        summary: "[Admin] Crear una nueva categoría",
        security: [{ BearerAuth: [] }], 
        requestBody: {
          required: true,
          content: { "application/json": { schema: { "$ref": "#/components/schemas/CategoriaInput" } } }
        },
        responses: {
          "201": { description: "Categoría creada." },
          "401": { description: "No autorizado." },
          "403": { description: "Acceso prohibido (No admin)." }
        }
      }
    },
    "/categorias/{id}": {
      get: {
        tags: ["Categorías"],
        summary: "Obtener una categoría por ID",
        security: [], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Categoría encontrada." },
          "404": { description: "Categoría no encontrada." }
        }
      },
      patch: {
        tags: ["Categorías"],
        summary: "[Admin] Actualizar una categoría",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { "$ref": "#/components/schemas/CategoriaInput" } } }
        },
        responses: { "200": { description: "Categoría actualizada." } }
      },
      delete: {
        tags: ["Categorías"],
        summary: "[Admin] Eliminar una categoría",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Categoría eliminada." },
          "400": { description: "Error (ej. categoría en uso)." }
        }
      }
    },
    
    "/restaurantes": {
      get: {
        tags: ["Restaurantes"],
        summary: "Listar restaurantes (aprobados)",
        description: "Obtiene la lista de restaurantes aprobados. Permite filtrar por ID de categoría.",
        security: [],
        parameters: [
          { name: "categoria", in: "query", required: false, schema: { type: "string" }, description: "ID de la categoría para filtrar" }
        ],
        responses: { "200": { description: "Lista de restaurantes." } }
      },
      post: {
        tags: ["Restaurantes"],
        summary: "[Cliente] Proponer un nuevo restaurante",
        description: "Crea un restaurante con estado 'pendiente' de aprobación.",
        security: [{ BearerAuth: [] }], 
        requestBody: {
          required: true,
          content: { "application/json": { schema: { "$ref": "#/components/schemas/RestauranteInput" } } }
        },
        responses: { "201": { description: "Restaurante propuesto." } }
      }
    },
    "/restaurantes/admin/pendientes": {
      get: {
        tags: ["Restaurantes"],
        summary: "[Admin] Ver restaurantes pendientes de aprobación",
        security: [{ BearerAuth: [] }], 
        responses: { "200": { description: "Lista de restaurantes pendientes." } }
      }
    },
    "/restaurantes/{id}": {
      get: {
        tags: ["Restaurantes"],
        summary: "Obtener detalle de un restaurante",
        description: "Obtiene un restaurante (aprobado) con su categoría, platos y reseñas.",
        security: [], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Detalle del restaurante." } }
      },
      patch: {
        tags: ["Restaurantes"],
        summary: "[Admin] Actualizar un restaurante",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { "$ref": "#/components/schemas/RestauranteUpdateInput" } } }
        },
        responses: { "200": { description: "Restaurante actualizado." } }
      },
      delete: {
        tags: ["Restaurantes"],
        summary: "[Admin] Eliminar un restaurante",
        description: "Elimina un restaurante y todas sus reseñas y platos asociados (Transaccional).",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Restaurante eliminado." } }
      }
    },
    "/restaurantes/{id}/aprobar": {
      patch: {
        tags: ["Restaurantes"],
        summary: "[Admin] Aprobar un restaurante",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Restaurante aprobado." } }
      }
    },

    "/restaurantes/{id}/platos": {
      get: {
        tags: ["Platos"],
        summary: "Listar platos de un restaurante",
        security: [], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID del Restaurante" }],
        responses: { "200": { description: "Lista de platos." } }
      },
      post: {
        tags: ["Platos"],
        summary: "[Admin] Crear un plato para un restaurante",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID del Restaurante" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { "$ref": "#/components/schemas/PlatoInput" } } }
        },
        responses: { "201": { description: "Plato creado." } }
      }
    },
    "/platos/{id}": {
      patch: {
        tags: ["Platos"],
        summary: "[Admin] Actualizar un plato",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID del Plato" }],
        requestBody: {
          content: { "application/json": { schema: { "$ref": "#/components/schemas/PlatoUpdateInput" } } }
        },
        responses: { "200": { description: "Plato actualizado." } }
      },
      delete: {
        tags: ["Platos"],
        summary: "[Admin] Eliminar un plato",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID del Plato" }],
        responses: { "200": { description: "Plato eliminado." } }
      }
    },

    "/restaurantes/{id}/reseñas": {
      get: {
        tags: ["Reseñas"],
        summary: "Listar reseñas de un restaurante",
        security: [], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID del Restaurante" }],
        responses: { "200": { description: "Lista de reseñas." } }
      },
      post: {
        tags: ["Reseñas"],
        summary: "[Cliente] Crear una reseña para un restaurante",
        description: "Crea una reseña y recalcula el ranking (Transaccional).",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID del Restaurante" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { "$ref": "#/components/schemas/ReseñaInput" } } }
        },
        responses: { "201": { description: "Reseña creada." } }
      }
    },
    "/reseñas/{id}": {
      patch: {
        tags: ["Reseñas"],
        summary: "[Cliente] Actualizar reseña propia",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de la Reseña" }],
        requestBody: {
          content: { "application/json": { schema: { "$ref": "#/components/schemas/ReseñaUpdateInput" } } }
        },
        responses: { "200": { description: "Reseña actualizada." } }
      },
      delete: {
        tags: ["Reseñas"],
        summary: "[Cliente] Eliminar reseña propia",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de la Reseña" }],
        responses: { "200": { description: "Reseña eliminada." } }
      }
    },
    "/reseñas/{id}/like": {
      post: {
        tags: ["Reseñas"],
        summary: "[Cliente] Dar 'Like' a una reseña",
        description: "Registra un 'like' y recalcula el ranking (Transaccional).",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de la Reseña" }],
        responses: { "200": { description: "Voto registrado." } }
      }
    },
    "/reseñas/{id}/dislike": {
      post: {
        tags: ["Reseñas"],
        summary: "[Cliente] Dar 'Dislike' a una reseña",
        description: "Registra un 'dislike' y recalcula el ranking (Transaccional).",
        security: [{ BearerAuth: [] }], 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de la Reseña" }],
        responses: { "200": { description: "Voto registrado." } }
      }
    }
  },
  
  tags: [
    { name: "Autenticación", description: "Registro y login de usuarios" },
    { name: "Categorías", description: "Gestión de categorías de restaurantes" },
    { name: "Restaurantes", description: "Gestión de restaurantes y aprobaciones" },
    { name: "Platos", description: "Gestión de platos de restaurantes" },
    { name: "Reseñas", description: "Gestión de reseñas, calificaciones y likes/dislikes" }
  ]
};