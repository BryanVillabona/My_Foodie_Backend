import { Router } from 'express';
import * as controller from '../controllers/restaurantes.controller.js';
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