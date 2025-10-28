import { Router } from 'express';
import { httpRegister, httpLogin } from '../controllers/auth.controller.js';
import { registroDTO, loginDTO } from '../dtos/auth.dto.js';
import { validationDTO } from '../middlewares/validationDTO.js';

const router = Router();

// Ruta de Registro
router.post(
    '/register', 
    registroDTO, 
    validationDTO,
    httpRegister  
);

// Ruta de Login
router.post(
    '/login',
    loginDTO,
    validationDTO,
    httpLogin
);

export default router;