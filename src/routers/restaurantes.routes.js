import { Router } from 'express';
import * as controller from '../controllers/restaurantes.controller.js';
import { httpCrearPlato, httpObtenerPlatosPorRestaurante } from '../controllers/platos.controller.js';
import * as dtosPlatos from '../dtos/platos.dto.js';

import * as dtos from '../dtos/restaurantes.dto.js';
import { validationDTO } from '../middlewares/validationDTO.js';
import { autenticar, autorizarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

//Rutas Públicas
router.get(
    '/',
    dtos.queryCategoriaDTO,
    validationDTO,
    controller.httpObtenerRestaurantes
);

router.get(
    '/:id',
    dtos.paramIdDTO,
    validationDTO,
    controller.httpObtenerRestaurantePorId
);

//Rutas de Usuario Logueado
router.post(
    '/',
    autenticar,
    dtos.crearRestauranteDTO,
    validationDTO,
    controller.httpCrearRestaurante
);

//Rutas de Administrador
router.get(
    '/admin/pendientes',
    autenticar,
    autorizarAdmin,
    controller.httpObtenerRestaurantesPendientes
);

router.patch(
    '/:id/aprobar',
    autenticar,
    autorizarAdmin,
    dtos.paramIdDTO,
    validationDTO,
    controller.httpAprobarRestaurante
);

router.patch(
    '/:id',
    autenticar,
    autorizarAdmin,
    [...dtos.paramIdDTO, ...dtos.actualizarRestauranteDTO],
    validationDTO,
    controller.httpActualizarRestaurante
);

router.delete(
    '/:id',
    autenticar,
    autorizarAdmin,
    dtos.paramIdDTO,
    validationDTO,
    controller.httpEliminarRestaurante
);

//Rutas Anidadas de Platos

router.post(
    '/:id/platos',
    autenticar,
    autorizarAdmin,
    [dtos.paramIdDTO, ...dtosPlatos.crearPlatoDTO],
    validationDTO,
    httpCrearPlato
);

router.get(
    '/:id/platos',
    dtos.paramIdDTO,
    validationDTO,
    httpObtenerPlatosPorRestaurante
);

export default router;