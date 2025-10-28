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

export async function obtenerPlatosPorRestaurante(restauranteId) {
    const db = obtenerBD();
    return await db.collection(COLECCION_PLATOS).find({ 
        restauranteId: new ObjectId(restauranteId) 
    }).toArray();
}

export async function actualizarPlato(platoId, datos) {
    const db = obtenerBD();
    
    if (datos.nombre) {
        const platoActual = await db.collection(COLECCION_PLATOS).findOne({ _id: new ObjectId(platoId) });
        if (!platoActual) throw new Error('Plato no encontrado.');
        
        const platoExistente = await db.collection(COLECCION_PLATOS).findOne({
            _id: { $ne: new ObjectId(platoId) },
            restauranteId: platoActual.restauranteId,
            nombre: datos.nombre
        });
        if (platoExistente) {
            throw new Error('Ya existe otro plato con ese nombre en este restaurante.');
        }
    }

    const resultado = await db.collection(COLECCION_PLATOS).updateOne(
        { _id: new ObjectId(platoId) },
        { $set: datos }
    );
    if (resultado.matchedCount === 0) throw new Error('Plato no encontrado.');
    return { message: 'Plato actualizado.' };
}

export async function eliminarPlato(platoId) {
    const db = obtenerBD();
    const resultado = await db.collection(COLECCION_PLATOS).deleteOne({ _id: new ObjectId(platoId) });
    if (resultado.deletedCount === 0) throw new Error('Plato no encontrado.');
    return { message: 'Plato eliminado.' };
}