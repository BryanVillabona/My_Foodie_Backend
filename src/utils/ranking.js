// bryanvillabona/my_foodie_backend/My_Foodie_Backend-f44ef5f0de3bcfd2848ea035dd94ea8d5fd91ead/src/utils/ranking.js

import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_RESEÑAS = 'reseñas';
const COLECCION_RESTAURANTES = 'restaurantes';

const DIAS_RECIENTE = 90; 

// --- ¡Pesos de Ponderación Ajustados! ---
const PESO_LIKE = 0.2;        // Un like suma 0.2 estrellas
const PESO_DISLIKE = -0.15;   // Un dislike resta 0.15 estrellas
const FACTOR_ANTIGUEDAD_NUEVO = 1.05; // Reseña nueva vale un 5% más
const FACTOR_ANTIGUEDAD_VIEJO = 0.95; // Reseña vieja vale un 5% menos

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
        const hoy = new Date();

        reseñas.forEach(reseña => {
            // 1. La calificación base AHORA ES 1-5 (no 5-25)
            const calificacionBase = reseña.calificacion; 

            // 2. Los factores sociales son modificadores pequeños
            const factorSocial = (reseña.likes.length * PESO_LIKE) + (reseña.dislikes.length * PESO_DISLIKE);
            
            const diasPasados = (hoy - new Date(reseña.fecha)) / (1000 * 60 * 60 * 24);
            
            // 3. Los factores de antigüedad son multiplicadores pequeños
            let factorAntiguedad = FACTOR_ANTIGUEDAD_VIEJO;
            if (diasPasados < DIAS_RECIENTE) {
                factorAntiguedad = FACTOR_ANTIGUEDAD_NUEVO;
            }

            // 4. Se calcula el puntaje de esta reseña
            // (ej: (5 estrellas + 0.2 like) * 1.05 antigüedad = 5.46)
            const puntajeReseña = (calificacionBase + factorSocial) * factorAntiguedad;
            
            puntajePonderadoTotal += puntajeReseña;
        });

        // 5. Se promedia el total
        rankingFinal = puntajePonderadoTotal / reseñas.length;

        // 6. --- ¡EL PASO CLAVE! ---
        // Limitamos (clamp) el ranking final para que esté SIEMPRE entre 1 y 5.
        if (rankingFinal > 5) rankingFinal = 5;
        if (rankingFinal < 1) rankingFinal = 1;
    }

    // El 'rankingPonderado' ahora es un valor como 4.8, 3.2, 5.0, etc.
    await db.collection(COLECCION_RESTAURANTES).updateOne(
        { _id: id },
        { $set: { rankingPonderado: rankingFinal } },
        { session }
    );
}