import * as services from '../services/platos.services.js';

export async function httpCrearPlato(req, res) {
    try {
        const { id: restauranteId } = req.params;
        const result = await services.crearPlato(restauranteId, req.body);
        res.status(201).json(result);
    } catch (error) {
        const statusCode = error.message.includes('Restaurante no encontrado') ? 404 : 400;
        res.status(statusCode).json({ error: error.message });
    }
}

export async function httpObtenerPlatosPorRestaurante(req, res) {
    try {
        const { id: restauranteId } = req.params;
        const platos = await services.obtenerPlatosPorRestaurante(restauranteId);
        res.status(200).json(platos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function httpActualizarPlato(req, res) {
    try {
        const { id: platoId } = req.params;
        const result = await services.actualizarPlato(platoId, req.body);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message.includes('Plato no encontrado') ? 404 : 400;
        res.status(statusCode).json({ error: error.message });
    }
}

export async function httpEliminarPlato(req, res) {
    try {
        const { id: platoId } = req.params;
        const result = await services.eliminarPlato(platoId);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}