import { conectarBD, obtenerBD, obtenerCliente } from './config/db.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { recalcularRanking } from './utils/ranking.js';

const PLACEHOLDER_RESTAURANTE_IMG = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&h=400&fit=crop';
const PLACEHOLDER_PLATO_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';

const COLECCION_USUARIOS = 'usuarios';
const COLECCION_CATEGORIAS = 'categorias';
const COLECCION_RESTAURANTES = 'restaurantes';
const COLECCION_PLATOS = 'platos';
const COLECCION_RESEÑAS = 'reseñas';

async function seed() {
    console.log("Iniciando el proceso de seeding...");
    await conectarBD();
    const db = obtenerBD();
    const cliente = obtenerCliente(); 

    console.log("Limpiando colecciones existentes...");
    await db.collection(COLECCION_USUARIOS).deleteMany({});
    await db.collection(COLECCION_CATEGORIAS).deleteMany({});
    await db.collection(COLECCION_RESTAURANTES).deleteMany({});
    await db.collection(COLECCION_PLATOS).deleteMany({});
    await db.collection(COLECCION_RESEÑAS).deleteMany({});
    console.log("Collections limpiadas.");

    console.log("Creando usuarios...");
    const salt = await bcrypt.genSalt(10);
    const usuariosData = [
        { nombre: "Admin Foodie", email: "admin@myfoodie.com", password: await bcrypt.hash("admin123", salt), rol: "admin" },
        { nombre: "Ana García", email: "ana.garcia@correo.com", password: await bcrypt.hash("ana123", salt), rol: "cliente" },
        { nombre: "Carlos Pérez", email: "carlos.perez@correo.com", password: await bcrypt.hash("carlos123", salt), rol: "cliente" },
        { nombre: "Sofía Rodríguez", email: "sofia.rodriguez@correo.com", password: await bcrypt.hash("sofia123", salt), rol: "cliente" }
    ];
    const usuariosInsertados = await db.collection(COLECCION_USUARIOS).insertMany(
        usuariosData.map(u => ({ ...u, createdAt: new Date() }))
    );
    const adminId = usuariosInsertados.insertedIds['0'];
    const anaId = usuariosInsertados.insertedIds['1'];
    const carlosId = usuariosInsertados.insertedIds['2'];
    const sofiaId = usuariosInsertados.insertedIds['3'];
    console.log(` -> ${Object.keys(usuariosInsertados.insertedIds).length} usuarios creados.`);

    console.log("Creando categorías...");
    const categoriasData = [
        { nombre: "Típica Colombiana", descripcion: "Platos tradicionales de Colombia." },
        { nombre: "Comida Rápida", descripcion: "Hamburguesas, perros calientes, etc." },
        { nombre: "Italiana", descripcion: "Pizza, pasta y más." },
        { nombre: "Asiática", descripcion: "Sushi, ramen, wok." },
        { nombre: "Vegetariana/Vegana", descripcion: "Opciones sin carne." }
    ];
    const categoriasInsertados = await db.collection(COLECCION_CATEGORIAS).insertMany(
        categoriasData.map(c => ({ ...c, createdAt: new Date() }))
    );
    const catTipicaId = categoriasInsertados.insertedIds['0'];
    const catRapidaId = categoriasInsertados.insertedIds['1'];
    const catItalianaId = categoriasInsertados.insertedIds['2'];
    const catAsiaticaId = categoriasInsertados.insertedIds['3'];
    const catVegId = categoriasInsertados.insertedIds['4'];
    console.log(` -> ${Object.keys(categoriasInsertados.insertedIds).length} categorías creadas.`);

    console.log("Creando restaurantes...");
    const restaurantesData = [
        { nombre: "Andrés Carne de Res (Chía)", descripcion: "Experiencia culinaria y cultural única.", ubicacion: "Chía, Cundinamarca", categoriaId: catTipicaId, creadoPor: anaId, estado: "aprobado", imagenUrl: PLACEHOLDER_RESTAURANTE_IMG },
        { nombre: "El Cielo", descripcion: "Cocina creativa y moderna colombiana.", ubicacion: "Medellín, Antioquia", categoriaId: catTipicaId, creadoPor: carlosId, estado: "aprobado", imagenUrl: PLACEHOLDER_RESTAURANTE_IMG },
        { nombre: "Home Burgers", descripcion: "Hamburguesas artesanales y malteadas.", ubicacion: "Bogotá D.C.", categoriaId: catRapidaId, creadoPor: sofiaId, estado: "aprobado", imagenUrl: PLACEHOLDER_RESTAURANTE_IMG },
        { nombre: "Archie's", descripcion: "Pizzas, pastas y comida italiana en ambiente familiar.", ubicacion: "Varias ciudades", categoriaId: catItalianaId, creadoPor: anaId, estado: "aprobado", imagenUrl: PLACEHOLDER_RESTAURANTE_IMG },
        { nombre: "Wok", descripcion: "Comida asiática variada, sushi y curries.", ubicacion: "Varias ciudades", categoriaId: catAsiaticaId, creadoPor: carlosId, estado: "aprobado", imagenUrl: PLACEHOLDER_RESTAURANTE_IMG },
        { nombre: "Restaurante Vegetariano El Integral", descripcion: "Opciones vegetarianas y veganas saludables.", ubicacion: "Bucaramanga, Santander", categoriaId: catVegId, creadoPor: sofiaId, estado: "pendiente", imagenUrl: PLACEHOLDER_RESTAURANTE_IMG },
    ];
    const restaurantesInsertados = await db.collection(COLECCION_RESTAURANTES).insertMany(
        restaurantesData.map(r => ({ 
            ...r, 
            imagenUrl: r.imagenUrl || PLACEHOLDER_RESTAURANTE_IMG,
            rankingPonderado: 0, 
            createdAt: new Date() 
        }))
    );
    const andresId = restaurantesInsertados.insertedIds['0'];
    const cieloId = restaurantesInsertados.insertedIds['1'];
    const homeId = restaurantesInsertados.insertedIds['2'];
    const archiesId = restaurantesInsertados.insertedIds['3'];
    const wokId = restaurantesInsertados.insertedIds['4'];
    console.log(` -> ${Object.keys(restaurantesInsertados.insertedIds).length} restaurantes creados.`);

    console.log("Creando platos...");
    const platosData = [
        { restauranteId: andresId, nombre: "Lomo al Trapo", descripcion: "Lomo fino de res envuelto en tela y cocido a la brasa.", precio: 75000 },
        { restauranteId: andresId, nombre: "Arepa de Choclo con Quesito", descripcion: "Arepa dulce de maíz tierno con queso campesino.", precio: 25000 },
        { restauranteId: cieloId, nombre: "Menú Degustación 'La Experiencia'", descripcion: "Viaje sensorial por la cocina colombiana moderna.", precio: 350000 },
        { restauranteId: homeId, nombre: "Bacon Cheese Burger", descripcion: "Carne angus, queso americano, tocineta ahumada.", precio: 28000 },
        { restauranteId: homeId, nombre: "Malteada de Oreo", descripcion: "Clásica malteada con galletas Oreo.", precio: 15000 },
        { restauranteId: archiesId, nombre: "Pizza Pepperoni Especial", descripcion: "Pizza con pepperoni, queso mozzarella y borde de queso.", precio: 45000 },
        { restauranteId: archiesId, nombre: "Pasta Carbonara", descripcion: "Pasta con salsa cremosa, tocineta y queso parmesano.", precio: 38000 },
        { restauranteId: wokId, nombre: "Sushi Moriawase", descripcion: "Selección variada de sushi y sashimi.", precio: 60000 },
        { restauranteId: wokId, nombre: "Pad Thai", descripcion: "Fideos de arroz salteados con camarones, tofu y maní.", precio: 42000 },
    ];
    await db.collection(COLECCION_PLATOS).insertMany(
        platosData.map(p => ({ 
            ...p, 
            imagenUrl: p.imagenUrl || PLACEHOLDER_PLATO_IMG,
            createdAt: new Date() 
        }))
    );
    console.log(` -> ${platosData.length} platos creados.`);

    console.log("Creando reseñas...");
    const reseñasData = [
        { restauranteId: andresId, usuarioId: carlosId, comentario: "¡El ambiente es increíble! La comida deliciosa aunque un poco costoso.", calificacion: 5, likes: [sofiaId], dislikes: [] },
        { restauranteId: andresId, usuarioId: sofiaId, comentario: "Buena música y comida, pero el servicio puede ser lento los fines de semana.", calificacion: 4, likes: [], dislikes: [carlosId] },
        { restauranteId: cieloId, usuarioId: anaId, comentario: "Una experiencia inolvidable, cada plato es una obra de arte.", calificacion: 5, likes: [carlosId, sofiaId], dislikes: [] },
        { restauranteId: homeId, usuarioId: anaId, comentario: "Las mejores hamburguesas de Bogotá, ¡sin duda!", calificacion: 5, likes: [carlosId], dislikes: [] },
        { restauranteId: homeId, usuarioId: carlosId, comentario: "Me encantan, aunque a veces el pan se desarma fácil.", calificacion: 4, likes: [anaId], dislikes: [] },
        { restauranteId: wokId, usuarioId: sofiaId, comentario: "El sushi es fresco y delicioso, buena variedad.", calificacion: 5, likes: [anaId], dislikes: [] },
    ];
    await db.collection(COLECCION_RESEÑAS).insertMany(
        reseñasData.map(r => ({ ...r, fecha: new Date() }))
    );
    console.log(` -> ${reseñasData.length} reseñas creadas.`);

    console.log("Recalculando rankings iniciales...");
    const restaurantesConReseñasIds = [...new Set(reseñasData.map(r => r.restauranteId.toString()))];

    const session = cliente.startSession();
    try {
        await session.withTransaction(async () => {
            for (const idStr of restaurantesConReseñasIds) {
                console.log(`  -> Recalculando para restaurante ID: ${idStr}`);
                await recalcularRanking(idStr, session);
            }
        });
        console.log("Rankings recalculados con éxito.");
    } catch (error) {
        console.error("Error recalculando rankings:", error);
    } finally {
        await session.endSession();
    }

    console.log("\nBase de datos poblada y lista para usar.");
    process.exit();
}

seed().catch(error => {
    console.error("Error en el proceso de seeding:", error);
    process.exit(1);
});