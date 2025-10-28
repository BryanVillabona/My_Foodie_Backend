import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_RESTAURANTES = 'restaurantes';
const COLECCION_CATEGORIAS = 'categorias';

export async function crearRestaurante(datos, usuarioId) {
    const { nombre, descripcion, ubicacion, categoriaId, imagenUrl } = datos;
    const db = obtenerBD();
    
    const restauranteExistente = await db.collection(COLECCION_RESTAURANTES).findOne({ nombre });
    if (restauranteExistente) {
        throw new Error('Ya existe un restaurante con ese nombre.');
    }
    
    const categoria = await db.collection(COLECCION_CATEGORIAS).findOne({ _id: new ObjectId(categoriaId) });
    if (!categoria) {
        throw new Error('La categoría especificada no existe.');
    }

    const nuevoRestaurante = {
        nombre,
        descripcion,
        ubicacion,
        categoriaId: new ObjectId(categoriaId),
        imagenUrl: imagenUrl || '',
        creadoPor: new ObjectId(usuarioId),
        estado: 'pendiente',
        rankingPonderado: 0, 
        createdAt: new Date()
    };
    
    await db.collection(COLECCION_RESTAURANTES).insertOne(nuevoRestaurante);
    return { message: 'Restaurante propuesto. Pendiente de aprobación.', restaurante: nuevoRestaurante };
}