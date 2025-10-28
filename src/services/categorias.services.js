import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_CATEGORIAS = 'categorias';
const COLECCION_RESTAURANTES = 'restaurantes';

export async function crearCategoria(datos) {
    const { nombre, descripcion } = datos;
    const db = obtenerBD();
    
    const categoriaExistente = await db.collection(COLECCION_CATEGORIAS).findOne({ nombre });
    if (categoriaExistente) {
        throw new Error('Ya existe una categoría con ese nombre.');
    }

    const nuevaCategoria = {
        nombre,
        descripcion: descripcion || '',
        createdAt: new Date()
    };

    await db.collection(COLECCION_CATEGORIAS).insertOne(nuevaCategoria);
    return { message: 'Categoría creada correctamente.', categoria: nuevaCategoria };
}

export async function obtenerCategorias() {
    const db = obtenerBD();
    return await db.collection(COLECCION_CATEGORIAS).find().toArray();
}

export async function obtenerCategoriaPorId(id) {
    const db = obtenerBD();
    const categoria = await db.collection(COLECCION_CATEGORIAS).findOne({ _id: new ObjectId(id) });
    if (!categoria) {
        throw new Error('Categoría no encontrada.');
    }
    return categoria;
}

export async function actualizarCategoria(id, datos) {
    const { nombre, descripcion } = datos;
    const db = obtenerBD();

    if (nombre) {
        const categoriaExistente = await db.collection(COLECCION_CATEGORIAS).findOne({ 
            nombre, 
            _id: { $ne: new ObjectId(id) }
        });
        if (categoriaExistente) {
            throw new Error('Ya existe otra categoría con ese nombre.');
        }
    }

    const resultado = await db.collection(COLECCION_CATEGORIAS).updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...datos } }
    );
    
    if (resultado.matchedCount === 0) {
        throw new Error('Categoría no encontrada.');
    }
    return { message: 'Categoría actualizada.' };
}

export async function eliminarCategoria(id) {
    const db = obtenerBD();
    const categoriaId = new ObjectId(id);

    const restauranteAsociado = await db.collection(COLECCION_RESTAURANTES).findOne(
        { categoriaId: categoriaId }
    );

    if (restauranteAsociado) {
        throw new Error('No se puede eliminar la categoría, está siendo utilizada por uno o más restaurantes.');
    }
    
    const resultado = await db.collection(COLECCION_CATEGORIAS).deleteOne({ _id: categoriaId });
    
    if (resultado.deletedCount === 0) {
        throw new Error('Categoría no encontrada.');
    }
    return { message: 'Categoría eliminada.' };
}