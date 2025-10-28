import * as services from '../services/reseñas.services.js';

export async function httpCrearReseña(req, res) {
    try {
        const { id: restauranteId } = req.params;
        const usuarioId = req.user._id;
        const result = await services.crearReseña(restauranteId, usuarioId, req.body);
        res.status(201).json(result);
    } catch (error) {
        const statusCode = error.message.includes('Restaurante no encontrado') ? 404 : 400;
        res.status(statusCode).json({ error: error.message });
    }
}

export async function httpObtenerReseñas(req, res) {
    try {
        const { id: restauranteId } = req.params;
        const reseñas = await services.obtenerReseñasPorRestaurante(restauranteId);
        res.status(200).json(reseñas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}