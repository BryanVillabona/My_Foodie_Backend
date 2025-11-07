import * as services from '../services/usuarios.services.js';

export async function httpGetNotificacionuser(req, res) {
    try {
        const usuarioId = req.user._id;
        const reseñas = await services.obtenerMisReseñas(usuarioId);
        res.status(200).json(reseñas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function httpGetMisReseñas(req, res) {
    try {
        const usuarioId = req.user._id;
        const reseñas = await services.obtenerMisReseñas(usuarioId);
        res.status(200).json(reseñas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function httpGetMisStats(req, res) {
    try {
        const usuarioId = req.user._id;
        const stats = await services.obtenerMisStats(usuarioId);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}