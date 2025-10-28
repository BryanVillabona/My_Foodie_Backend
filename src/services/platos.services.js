import { obtenerBD } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLECCION_PLATOS = 'platos';
const COLECCION_RESTAURANTES = 'restaurantes';

export async function crearPlato(restauranteId, datos) {
    const { nombre, descripcion, precio, imagenUrl } = datos;
    const db = obtenerBD();

    const restaurante = await db.collection(COLECCION_RESTAURANTES).findOne({ 
        _id: new ObjectId(restauranteId),
        estado: 'aprobado'
    });
    if (!restaurante) {
        throw new Error('Restaurante no encontrado o no aprobado.');
    }

    const platoExistente = await db.collection(COLECCION_PLATOS).findOne({ 
        restauranteId: new ObjectId(restauranteId), 
        nombre 
    });
    if (platoExistente) {
        throw new Error('Ya existe un plato con ese nombre en este restaurante.');
    }

    const nuevoPlato = {
        restauranteId: new ObjectId(restauranteId),
        nombre,
        descripcion,
        precio,
        imagenUrl: imagenUrl || '',
        createdAt: new Date()
    };

    await db.collection(COLECCION_PLATOS).insertOne(nuevoPlato);
    return { message: 'Plato creado correctamente.', plato: nuevoPlato };
}