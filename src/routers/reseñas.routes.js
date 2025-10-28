import { Router } from 'express';
import * as controller from '../controllers/reseñas.controller.js';
import * as dtos from '../dtos/reseñas.dto.js';
import { validationDTO } from '../middlewares/validationDTO.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

router.patch(
    '/:id',
    autenticar,
    [...dtos.paramReseñaIdDTO, ...dtos.actualizarReseñaDTO],
    validationDTO,
    controller.httpActualizarReseña
);

router.delete(
    '/:id',
    autenticar,
    dtos.paramReseñaIdDTO,
    validationDTO,
    controller.httpEliminarReseña
);

router.post(
    '/:id/like',
    autenticar,
    dtos.paramReseñaIdDTO,
    validationDTO,
    controller.httpLikeReseña
);

router.post(
    '/:id/dislike',
    autenticar,
    dtos.paramReseñaIdDTO,
    validationDTO,
    controller.httpDislikeReseña
);

export default router;