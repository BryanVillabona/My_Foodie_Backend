import * as services from '../services/restaurantes.services.js';

export async function httpObtenerRestaurantes(req, res) {
    try {
        const { categoria } = req.query;
        const restaurantes = await services.obtenerRestaurantes(categoria);
        res.status(200).json(restaurantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function httpObtenerRestaurantePorId(req, res) {
    try {
        const { id } = req.params;
        const restaurante = await services.obtenerRestaurantePorId(id);
        res.status(200).json(restaurante);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function httpCrearRestaurante(req, res) {
    try {
        const usuarioId = req.user._id; 
        const result = await services.crearRestaurante(req.body, usuarioId);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
}