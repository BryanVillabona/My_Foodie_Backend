import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_RESTAURANTES = 'restaurantes';
const COLECCION_CATEGORIAS = 'categorias';
const COLECCION_PLATOS = 'platos';

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

export async function obtenerRestaurantes(categoriaId) {
    const db = obtenerBD();
    
    const matchStage = { estado: 'aprobado' };
    
    if (categoriaId) {
        matchStage.categoriaId = new ObjectId(categoriaId);
    }
    
    const pipeline = [
        { $match: matchStage },
        { $sort: { rankingPonderado: -1, createdAt: -1 } },
        {
            $lookup: {
                from: COLECCION_CATEGORIAS,
                localField: 'categoriaId',
                foreignField: '_id',
                as: 'categoriaInfo'
            }
        },
        { $unwind: '$categoriaInfo' },
        { 
            $project: { 
                'categoriaInfo.descripcion': 0,
                'categoriaInfo.createdAt': 0 
            }
        }
    ];

    return await db.collection(COLECCION_RESTAURANTES).aggregate(pipeline).toArray();
}

export async function obtenerRestaurantePorId(id) {
    const db = obtenerBD();
    
    const pipeline = [
        { $match: { _id: new ObjectId(id), estado: 'aprobado' } },
        {
            $lookup: {
                from: COLECCION_CATEGORIAS,
                localField: 'categoriaId',
                foreignField: '_id',
                as: 'categoriaInfo'
            }
        },
        {
            $lookup: {
                from: COLECCION_PLATOS,
                localField: '_id',
                foreignField: 'restauranteId',
                as: 'platos'
            }
        },
        { $unwind: '$categoriaInfo' },
    ];

    const resultado = await db.collection(COLECCION_RESTAURANTES).aggregate(pipeline).toArray();
    
    if (resultado.length === 0) {
        throw new Error('Restaurante no encontrado o no aprobado.');
    }
    return resultado[0];
}

//Funciones de Admin

export async function obtenerRestaurantesPendientes() {
    const db = obtenerBD();
    const pipeline = [
        { $match: { estado: 'pendiente' } },
        { $sort: { createdAt: 1 } },
        {
            $lookup: {
                from: COLECCION_CATEGORIAS,
                localField: 'categoriaId',
                foreignField: '_id',
                as: 'categoriaInfo'
            }
        },
        { $unwind: '$categoriaInfo' }
    ];
    return await db.collection(COLECCION_RESTAURANTES).aggregate(pipeline).toArray();
}

export async function aprobarRestaurante(id) {
    const db = obtenerBD();
    const resultado = await db.collection(COLECCION_RESTAURANTES).updateOne(
        { _id: new ObjectId(id) },
        { $set: { estado: 'aprobado' } }
    );
    if (resultado.matchedCount === 0) throw new Error('Restaurante no encontrado.');
    return { message: 'Restaurante aprobado.' };
}

export async function actualizarRestaurante(id, datos) {
    const db = obtenerBD();
    const resultado = await db.collection(COLECCION_RESTAURANTES).updateOne(
        { _id: new ObjectId(id) },
        { $set: datos }
    );
    if (resultado.matchedCount === 0) throw new Error('Restaurante no encontrado.');
    return { message: 'Restaurante actualizado.' };
}

export async function eliminarRestaurante(id) {
    const db = obtenerBD();
    
    const resultado = await db.collection(COLECCION_RESTAURANTES).deleteOne({ _id: new ObjectId(id) });
    if (resultado.deletedCount === 0) throw new Error('Restaurante no encontrado.');
    return { message: 'Restaurante eliminado.' };
}