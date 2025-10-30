import express from "express";
import "dotenv/config";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { conectarBD } from "./config/db.js";
import passport from './config/passport.js';

import routerAuth from './routers/auth.routes.js';
import routerCategorias from './routers/categorias.routes.js';
import routerRestaurantes from './routers/restaurantes.routes.js';
import routerPlatos from './routers/platos.routes.js';
import routerReseñas from './routers/reseñas.routes.js';
import routerUsuarios from './routers/usuarios.routes.js';

import swaggerUI from 'swagger-ui-express';
import { swaggerDocument, APP_VERSION_STRING } from './docs/swaggerDoc.js';
import semver from 'semver';

// Config
const app = express();
app.use(express.json());

app.use(passport.initialize());

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate Limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100, 
	message: 'Demasiadas peticiones desde esta IP, intente de nuevo en 15 minutos.',
});
app.use(limiter);

//Ruta para documentación api
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Rutas
const apiV1Router = express.Router();

apiV1Router.use("/auth", routerAuth);
apiV1Router.use("/categorias", routerCategorias);
apiV1Router.use("/restaurantes", routerRestaurantes);
apiV1Router.use("/platos", routerPlatos);
apiV1Router.use("/resenas", routerReseñas);
apiV1Router.use("/usuarios", routerUsuarios);

app.use("/api/v1", apiV1Router);

app.get("/health", (req, res) => {
  res.status(200).json({ 
    message: "My Foodie Backend activo!!!", 
    version: semver.clean(APP_VERSION_STRING) 
  });
});

// Executions
conectarBD().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Backend escuchando en http://${process.env.HOST_NAME}:${process.env.PORT}`
    );
  });
});