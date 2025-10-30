import { obtenerBD } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const COLECCION_USUARIOS = 'usuarios';
const JWT_SECRET = process.env.JWT_SECRET;

export async function registrarUsuario(datos) {
    const { nombre, email, password } = datos;
    
    const db = obtenerBD();
    const coleccion = db.collection(COLECCION_USUARIOS);
    
    const usuarioExistente = await coleccion.findOne({ email });
    if (usuarioExistente) {
        throw new Error('El correo ya está registrado.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const nuevoUsuario = { 
        nombre, 
        email, 
        password: passwordHasheada,
        rol: 'cliente',
        createdAt: new Date()
    };
    
    await coleccion.insertOne(nuevoUsuario);
    
    return { message: 'Usuario registrado exitosamente.' };
}

export async function loginUsuario(credenciales) {
    const { email, password } = credenciales;
    
    const db = obtenerBD();
    const usuario = await db.collection(COLECCION_USUARIOS).findOne({ email });
    
    if (!usuario) {
        throw new Error('Credenciales inválidas.');
    }
    
    const esPasswordCorrecta = await bcrypt.compare(password, usuario.password);
    
    if (!esPasswordCorrecta) {
        throw new Error('Credenciales inválidas.');
    }

    const payload = {
        usuarioId: usuario._id.toString(),
        rol: usuario.rol,
        nombre: usuario.nombre
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...usuarioSinPassword } = usuario;
    
    return { 
        token,
        usuario: usuarioSinPassword
    };
}