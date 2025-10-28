import { body, param } from 'express-validator';

export const paramReseñaIdDTO = [
    param('id').isMongoId().withMessage('El ID de la reseña no es válido.')
];

export const crearReseñaDTO = [
    body('comentario')
        .isString().trim().notEmpty().withMessage('El comentario es obligatorio.'),
    body('calificacion')
        .isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser un número entero entre 1 y 5.')
];

export const actualizarReseñaDTO = [
    body('comentario')
        .optional()
        .isString().trim().notEmpty().withMessage('El comentario debe ser texto.'),
    body('calificacion')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser un número entero entre 1 y 5.')
];