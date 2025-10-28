import { body } from 'express-validator';

export const registroDTO = [
    body('nombre')
        .isString().withMessage('El nombre debe ser texto.')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.'),
    body('email')
        .isEmail().withMessage('Debe ser un correo electrónico válido.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
];

export const loginDTO = [
    body('email')
        .isEmail().withMessage('Debe ser un correo electrónico válido.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
];