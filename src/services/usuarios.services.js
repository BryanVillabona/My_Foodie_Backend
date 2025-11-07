import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_RESEÑAS = 'reseñas';
const COLECCION_RESTAURANTES = 'restaurantes';

export async function obtenernotificacionuser(usuarioId) {
    
    
}


export async function obtenerMisReseñas(usuarioId) {
    const db = obtenerBD();
    const pipeline = [
        { $match: { usuarioId: new ObjectId(usuarioId) } },
        { $sort: { fecha: -1 } },
        {
            $lookup: {
                from: COLECCION_RESTAURANTES,
                localField: 'restauranteId',
                foreignField: '_id',
                as: 'restauranteInfo'
            }
        },
        { $unwind: '$restauranteInfo' },
        { 
            $project: {
                'restauranteInfo.descripcion': 0,
                'restauranteInfo.creadoPor': 0,
                'restauranteInfo.estado': 0
            }
        }
    ];
    return await db.collection(COLECCION_RESEÑAS).aggregate(pipeline).toArray();
}

export async function obtenerMisStats(usuarioId) {
    const db = obtenerBD();
    const id = new ObjectId(usuarioId);

    const misReseñas = await db.collection(COLECCION_RESEÑAS).find(
        { usuarioId: id }
    ).toArray();

    const totalReseñas = misReseñas.length;
    if (totalReseñas === 0) {
        return { totalReseñas: 0, promedio: 0, favorito: "N/A" };
    }

    const sumaCalificaciones = misReseñas.reduce((acc, reseña) => acc + reseña.calificacion, 0);
    const promedio = (sumaCalificaciones / totalReseñas).toFixed(1);

    const reseñaFavorita = misReseñas.sort((a, b) => b.calificacion - a.calificacion)[0];
    const restauranteFav = await db.collection(COLECCION_RESTAURANTES).findOne(
        { _id: reseñaFavorita.restauranteId },
        { projection: { nombre: 1 } }
    );

    return {
        totalReseñas,
        promedio,
        favorito: restauranteFav.nombre || "N/A"
    };
}