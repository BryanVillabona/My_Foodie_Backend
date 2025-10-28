import { obtenerBD, obtenerCliente } from '../config/db.js';
import { ObjectId } from 'mongodb';
import { recalcularRanking } from '../utils/ranking.js';

const COLECCION_RESEÑAS = 'reseñas';
const COLECCION_RESTAURANTES = 'restaurantes';

export async function crearReseña(restauranteId, usuarioId, datos) {
    const { comentario, calificacion } = datos;
    const db = obtenerBD();
    const cliente = obtenerCliente();
    const session = cliente.startSession();

    try {
        let resultado;
        await session.withTransaction(async () => {
            const restaurante = await db.collection(COLECCION_RESTAURANTES).findOne(
                { _id: new ObjectId(restauranteId), estado: 'aprobado' },
                { session }
            );
            if (!restaurante) {
                throw new Error('Restaurante no encontrado o no aprobado.');
            }

            const reseñaExistente = await db.collection(COLECCION_RESEÑAS).findOne(
                { restauranteId: new ObjectId(restauranteId), usuarioId: new ObjectId(usuarioId) },
                { session }
            );
            if (reseñaExistente) {
                throw new Error('Ya has enviado una reseña para este restaurante.');
            }

            const nuevaReseña = {
                restauranteId: new ObjectId(restauranteId),
                usuarioId: new ObjectId(usuarioId),
                comentario,
                calificacion,
                fecha: new Date(),
                likes: [],
                dislikes: []
            };
            resultado = await db.collection(COLECCION_RESEÑAS).insertOne(nuevaReseña, { session });

            await recalcularRanking(restauranteId, session);
        });
        
        return { message: 'Reseña creada con éxito.', reseñaId: resultado.insertedId };
    } catch (error) {
        throw error;
    } finally {
        await session.endSession(); 
    }
}

export async function obtenerReseñasPorRestaurante(restauranteId) {
    const db = obtenerBD();
    const pipeline = [
        { $match: { restauranteId: new ObjectId(restauranteId) } },
        { $sort: { fecha: -1 } },
        {
            $lookup: {
                from: 'usuarios',
                localField: 'usuarioId',
                foreignField: '_id',
                as: 'usuarioInfo'
            }
        },
        { $unwind: '$usuarioInfo' },
        { 
            $project: { 
                'usuarioInfo.password': 0,
                'usuarioInfo.email': 0,
                'usuarioInfo.rol': 0,
                'usuarioInfo.createdAt': 0
            }
        }
    ];
    return await db.collection(COLECCION_RESEÑAS).aggregate(pipeline).toArray();
}

export async function actualizarReseña(reseñaId, usuarioId, datos) {
    const db = obtenerBD();
    const cliente = obtenerCliente();
    const session = cliente.startSession();

    try {
        await session.withTransaction(async () => {
            const reseña = await db.collection(COLECCION_RESEÑAS).findOne(
                { _id: new ObjectId(reseñaId) }, { session }
            );
            if (!reseña) throw new Error('Reseña no encontrada.');

            if (reseña.usuarioId.toString() !== usuarioId.toString()) {
                throw new Error('No autorizado para editar esta reseña.');
            }
            
            await db.collection(COLECCION_RESEÑAS).updateOne(
                { _id: new ObjectId(reseñaId) },
                { $set: { ...datos, fecha: new Date() } },
                { session }
            );

            await recalcularRanking(reseña.restauranteId, session);
        });
        return { message: 'Reseña actualizada.' };
    } finally {
        await session.endSession();
    }
}