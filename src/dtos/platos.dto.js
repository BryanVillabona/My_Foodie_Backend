import { body, param } from 'express-validator';

export const paramPlatoIdDTO = [
    param('id').isMongoId().withMessage('El ID del plato no es válido.')
];

export const crearPlatoDTO = [
    body('nombre')
        .isString().trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('descripcion')
        .isString().trim().notEmpty().withMessage('La descripción es obligatoria.'),
    body('precio')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo.'),
    body('imagenUrl')
        .optional()
        .isURL().withMessage('La imagen debe ser una URL válida.')
];

export const actualizarPlatoDTO = [
    body('nombre')
        .optional()
        .isString().trim().notEmpty().withMessage('El nombre debe ser texto.'),
    body('descripcion')
        .optional()
        .isString().trim().notEmpty().withMessage('La descripción debe ser texto.'),
    body('precio')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo.'),
    body('imagenUrl')
        .optional()
        .isURL().withMessage('La imagen debe ser una URL válida.')
];