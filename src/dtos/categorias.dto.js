import { body, param } from 'express-validator';
import { ObjectId } from 'mongodb';

export const categoriaDTO = [
    body('nombre')
        .isString().withMessage('El nombre debe ser texto.')
        .trim()
        .notEmpty().withMessage('El nombre de la categoría es obligatorio.'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto.')
        .trim()
];

export const categoriaParamIdDTO = [
    param('id')
        .isMongoId().withMessage('El ID de la categoría no es válido.')
];