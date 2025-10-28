import { Router } from 'express';
import {
    httpCrearCategoria,
    httpObtenerCategorias,
    httpObtenerCategoriaPorId,
    httpActualizarCategoria,
    httpEliminarCategoria
} from '../controllers/categorias.controller.js';
import { categoriaDTO, categoriaParamIdDTO } from '../dtos/categorias.dto.js';
import { validationDTO } from '../middlewares/validationDTO.js';
import { autenticar, autorizarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

//Rutas Públicas de solo GET
// para btener todas las categorías
router.get('/', httpObtenerCategorias);

// para obtener una categoría por ID
router.get(
    '/:id', 
    categoriaParamIdDTO,
    validationDTO, 
    httpObtenerCategoriaPorId
);

// rutas privadas para admin
// Crear una nueva categoría
router.post(
    '/',
    autenticar,         
    autorizarAdmin,     
    categoriaDTO,      
    validationDTO,
    httpCrearCategoria
);

// Actualizar una categoría
router.patch(
    '/:id',
    autenticar,
    autorizarAdmin,
    [...categoriaParamIdDTO, ...categoriaDTO],
    validationDTO,
    httpActualizarCategoria
);

// Eliminar una categoría
router.delete(
    '/:id',
    autenticar,
    autorizarAdmin,
    categoriaParamIdDTO,
    validationDTO,
    httpEliminarCategoria
);

export default router;