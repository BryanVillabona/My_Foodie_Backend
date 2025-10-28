import { Router } from 'express';
import { httpActualizarPlato, httpEliminarPlato } from '../controllers/platos.controller.js';
import * as dtos from '../dtos/platos.dto.js';
import { validationDTO } from '../middlewares/validationDTO.js';
import { autenticar, autorizarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.patch(
    '/:id',
    autenticar,
    autorizarAdmin,
    [...dtos.paramPlatoIdDTO, ...dtos.actualizarPlatoDTO],
    validationDTO,
    httpActualizarPlato
);

router.delete(
    '/:id',
    autenticar,
    autorizarAdmin,
    dtos.paramPlatoIdDTO,
    validationDTO,
    httpEliminarPlato
);

export default router;