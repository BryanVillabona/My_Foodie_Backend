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

export async function httpActualizarReseña(req, res) {
    try {
        const { id: reseñaId } = req.params;
        const usuarioId = req.user._id;
        const result = await services.actualizarReseña(reseñaId, usuarioId, req.body);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message.includes('No autorizado') ? 403 : 404;
        res.status(statusCode).json({ error: error.message });
    }
}

export async function httpEliminarReseña(req, res) {
    try {
        const { id: reseñaId } = req.params;
        const usuarioId = req.user._id;
        const result = await services.eliminarReseña(reseñaId, usuarioId);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message.includes('No autorizado') ? 403 : 404;
        res.status(statusCode).json({ error: error.message });
    }
}

export async function httpLikeReseña(req, res) {
    try {
        const { id: reseñaId } = req.params;
        const usuarioId = req.user._id;
        const result = await services.likeDislikeReseña(reseñaId, usuarioId, 'like');
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message.includes('propia reseña') ? 400 : 404;
        res.status(statusCode).json({ error: error.message });
    }
}

export async function httpDislikeReseña(req, res) {
    try {
        const { id: reseñaId } = req.params;
        const usuarioId = req.user._id;
        const result = await services.likeDislikeReseña(reseñaId, usuarioId, 'dislike');
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message.includes('propia reseña') ? 400 : 404;
        res.status(statusCode).json({ error: error.message });
    }
}