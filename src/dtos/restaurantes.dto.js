import { body, param, query } from 'express-validator';

export const paramIdDTO = [
    param('id').isMongoId().withMessage('El ID no es válido.')
];

export const queryCategoriaDTO = [
    query('categoria')
        .optional()
        .isMongoId().withMessage('El ID de la categoría no es válido.')
];

export const crearRestauranteDTO = [
    body('nombre')
        .isString().trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('descripcion')
        .isString().trim().notEmpty().withMessage('La descripción es obligatoria.'),
    body('ubicacion')
        .isString().trim().notEmpty().withMessage('La ubicación es obligatoria.'),
    body('categoriaId')
        .isMongoId().withMessage('El ID de la categoría no es válido.'),
    body('imagenUrl')
        .optional()
        .isURL().withMessage('La imagen debe ser una URL válida.')
];

export const actualizarRestauranteDTO = [
    body('nombre')
        .optional()
        .isString().trim().notEmpty().withMessage('El nombre debe ser texto.'),
    body('descripcion')
        .optional()
        .isString().trim().notEmpty().withMessage('La descripción debe ser texto.'),
    body('ubicacion')
        .optional()
        .isString().trim().notEmpty().withMessage('La ubicación debe ser texto.'),
    body('categoriaId')
        .optional()
        .isMongoId().withMessage('El ID de la categoría no es válido.'),
    body('imagenUrl')
        .optional()
        .isURL().withMessage('La imagen debe ser una URL válida.'),
    body('estado')
        .optional()
        .isIn(['pendiente', 'aprobado']).withMessage("El estado solo puede ser 'pendiente' o 'aprobado'.")
];