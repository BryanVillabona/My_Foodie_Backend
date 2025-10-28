import {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
} from '../services/categorias.services.js';

export async function httpCrearCategoria(req, res) {
    try {
        const result = await crearCategoria(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function httpObtenerCategorias(req, res) {
    try {
        const categorias = await obtenerCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorías.' });
    }
}

export async function httpObtenerCategoriaPorId(req, res) {
    try {
        const { id } = req.params;
        const categoria = await obtenerCategoriaPorId(id);
        res.status(200).json(categoria);
    } catch (error) {
        res.status(404).json({ error: error.message }); 
    }
}

export async function httpActualizarCategoria(req, res) {
    try {
        const { id } = req.params;
        const result = await actualizarCategoria(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message === 'Categoría no encontrada.' ? 404 : 400;
        res.status(statusCode).json({ error: error.message });
    }
}

export async function httpEliminarCategoria(req, res) {
    try {
        const { id } = req.params;
        const result = await eliminarCategoria(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Categoría no encontrada.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}