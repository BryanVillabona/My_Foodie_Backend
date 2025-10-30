import { Router } from 'express';
import * as controller from '../controllers/usuarios.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
    '/mis-resenas',
    autenticar,
    controller.httpGetMisReseñas
);

router.get(
    '/mis-stats',
    autenticar,
    controller.httpGetMisStats
);

export default router;