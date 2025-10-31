import { obtenerBD, obtenerCliente } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_RESTAURANTES = 'restaurantes';
const COLECCION_CATEGORIAS = 'categorias';
const COLECCION_RESEÑAS = 'reseñas';
const COLECCION_PLATOS = 'platos';

const PLACEHOLDER_RESTAURANTE_IMG = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&h=400&fit=crop';

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
        imagenUrl: imagenUrl || PLACEHOLDER_RESTAURANTE_IMG,
        creadoPor: new ObjectId(usuarioId),
        estado: 'pendiente',
        rankingPonderado: 0, 
        createdAt: new Date()
    };
    
    await db.collection(COLECCION_RESTAURANTES).insertOne(nuevoRestaurante);
    return { message: 'Restaurante propuesto. Pendiente de aprobación.', restaurante: nuevoRestaurante };
}

export async function obtenerRestaurantes(categoriaId, sort = 'ranking') {
    const db = obtenerBD();
    
    const matchStage = { estado: 'aprobado' };
    
    if (categoriaId) {
        matchStage.categoriaId = new ObjectId(categoriaId);
    }
    
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: COLECCION_RESEÑAS,
                localField: '_id',
                foreignField: 'restauranteId',
                as: 'reseñas'
            }
        },
        {
            $addFields: {
                totalReseñas: { $size: '$reseñas' }
            }
        }
    ];

    let sortStage = {};
    if (sort === 'popularidad') {
        sortStage = { $sort: { totalReseñas: -1, rankingPonderado: -1 } };
    } else if (sort === 'recientes') {
        sortStage = { $sort: { createdAt: -1 } };
    } else { 
        sortStage = { $sort: { rankingPonderado: -1, createdAt: -1 } };
    }
    
    pipeline.push(sortStage);

    pipeline.push(
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
                _id: 1,
                nombre: 1,
                descripcion: 1,
                ubicacion: 1,
                imagenUrl: 1,
                estado: 1,
                rankingPonderado: 1,
                createdAt: 1,
                categoriaId: 1,
                totalReseñas: 1,
                categoriaInfo: {
                    _id: "$categoriaInfo._id",
                    nombre: "$categoriaInfo.nombre"
                }
            }
        }
    );

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
    
    const datosActualizar = { ...datos };

    if (datosActualizar.categoriaId) {
        datosActualizar.categoriaId = new ObjectId(datosActualizar.categoriaId);
    }

    if (datosActualizar.imagenUrl === null || datosActualizar.imagenUrl === '') {
        datosActualizar.imagenUrl = PLACEHOLDER_RESTAURANTE_IMG;
    }

    const resultado = await db.collection(COLECCION_RESTAURANTES).updateOne(
        { _id: new ObjectId(id) },
        { $set: datosActualizar }
    );
    
    if (resultado.matchedCount === 0) throw new Error('Restaurante no encontrado.');
    return { message: 'Restaurante actualizado.' };
}

export async function eliminarRestaurante(id) {
    const db = obtenerBD();
    const cliente = obtenerCliente();
    const session = cliente.startSession();
    const restauranteId = new ObjectId(id);

    try {
        await session.withTransaction(async () => {
            await db.collection(COLECCION_RESEÑAS).deleteMany(
                { restauranteId: restauranteId }, { session }
            );

            await db.collection(COLECCION_PLATOS).deleteMany(
                { restauranteId: restauranteId }, { session }
            );

            const resultado = await db.collection(COLECCION_RESTAURANTES).deleteOne(
                { _id: restauranteId }, { session }
            );
            
            if (resultado.deletedCount === 0) {
                throw new Error('Restaurante no encontrado.');
            }
        });
        
        return { message: 'Restaurante y todos sus datos asociados fueron eliminados.' };
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
}