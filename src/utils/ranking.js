import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_RESEÑAS = 'reseñas';
const COLECCION_RESTAURANTES = 'restaurantes';

export async function recalcularRanking(restauranteId, session) {
    const db = obtenerBD();
    const id = new ObjectId(restauranteId);

    const reseñas = await db.collection(COLECCION_RESEÑAS).find(
        { restauranteId: id },
        { session }
    ).toArray();

    let rankingFinal = 0;

    if (reseñas.length > 0) {
        let puntajePonderadoTotal = 0;

        reseñas.forEach(reseña => {
            const calificacionBase = reseña.calificacion * 5;
            const factorSocial = (reseña.likes.length * 1.5) - (reseña.dislikes.length * 1.0);
            
            const puntajeReseña = calificacionBase + factorSocial;
            puntajePonderadoTotal += puntajeReseña;
        });

        rankingFinal = puntajePonderadoTotal / reseñas.length;
    }

    await db.collection(COLECCION_RESTAURANTES).updateOne(
        { _id: id },
        { $set: { rankingPonderado: rankingFinal } },
        { session }
    );
}