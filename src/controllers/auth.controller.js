import { registrarUsuario, loginUsuario } from '../services/auth.services.js';


export async function httpNotificacionuser(req, res) {
    try {
        const noti = await notificacion(req.body);
        res.status(201).json(noti);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function httpRegister(req, res) {
    try {
        const result = await registrarUsuario(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function httpLogin(req, res) {
    try {
        const data = await loginUsuario(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}