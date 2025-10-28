import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_CATEGORIAS = 'categorias';

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