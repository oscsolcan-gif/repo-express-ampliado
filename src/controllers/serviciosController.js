// CONTROLADOR DE SERVICIOS: los 5 endpoints del CRUD.
// Nombres como en clase: acción + cuántos + recurso + "ById" si el camino lleva /:id.
// Cada función recibe req (lo que pide quien llama) y resp (lo que le contestamos).
//
// Reglas que se repiten en todas:
//   - Todo lo asíncrono va dentro de try/catch y con await.
//   - Cada rama termina en una respuesta con "return" (si no, el código sigue y contesta dos veces).
//   - Un error 4xx o 5xx lleva ok: false. Un éxito, ok: true.
//   - Al cliente nunca se le manda el objeto "error": el detalle va a la consola del servidor.

import { Servicio } from '../models/ServicioModel.js';

// Un id de MongoDB mal formado (por ejemplo "abc") hace que Mongoose lance un CastError.
// Es un fallo de quien llama, no del servidor: se contesta 400, no 500.
const esIdMalFormado = (error) => error.name === 'CastError';


// 1. GET /api/v1/servicios -> todos los servicios
export const getAllServices = async (req, resp) => {
    try {
        // find() devuelve SIEMPRE un array; si no hay servicios, un array vacío []
        const servicios = await Servicio.find();

        return resp.status(200).json({
            ok: true,
            msg: 'Servicios obtenidos',
            servicios
        });

    } catch (error) {
        console.error(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error de servidor, póngase en contacto con el administrador'
        });
    }
};


// 2. GET /api/v1/servicios/:id -> un servicio por su id
export const getAServiceById = async (req, resp) => {
    try {
        const id = req.params.id;

        // findById devuelve el documento o null si no existe
        const servicio = await Servicio.findById(id);

        if (!servicio) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el servicio'
            });
        }

        return resp.status(200).json({
            ok: true,
            msg: 'Servicio obtenido',
            servicio
        });

    } catch (error) {
        if (esIdMalFormado(error)) {
            return resp.status(400).json({ ok: false, msg: 'El id no es válido' });
        }
        console.error(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error de servidor, póngase en contacto con el administrador'
        });
    }
};


// 3. POST /api/v1/servicios -> crear un servicio con los datos del cuerpo (req.body)
export const createAService = async (req, resp) => {
    try {
        // "?? {}": en Express 5, si no llega cuerpo, req.body es undefined y desestructurarlo rompería
        const { nombre, descripcion, precio } = req.body ?? {};

        // Primero lo que se deniega: si falta algún dato, 400 y return
        if (!nombre || !descripcion || precio === undefined) {
            return resp.status(400).json({
                ok: false,
                msg: 'Faltan datos: nombre, descripcion y precio son obligatorios'
            });
        }

        // Solo guardamos los tres campos del esquema (no pasamos req.body entero)
        const servicio = await Servicio.create({ nombre, descripcion, precio });

        // 201 = creado
        return resp.status(201).json({
            ok: true,
            msg: 'Servicio creado correctamente',
            servicio
        });

    } catch (error) {
        // ValidationError: llegó un dato con tipo incorrecto (por ejemplo, precio "abc")
        if (error.name === 'ValidationError') {
            return resp.status(400).json({ ok: false, msg: 'Algún dato no tiene el tipo correcto' });
        }
        console.error(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error de servidor, póngase en contacto con el administrador'
        });
    }
};


// 4. PUT /api/v1/servicios/:id -> modificar un servicio
export const updateAServiceById = async (req, resp) => {
    try {
        const id = req.params.id;
        const { nombre, descripcion, precio } = req.body ?? {};

        if (nombre === undefined && descripcion === undefined && precio === undefined) {
            return resp.status(400).json({
                ok: false,
                msg: 'No hay nada que modificar: envía nombre, descripcion o precio'
            });
        }

        // new: true -> devuelve el documento YA modificado (por defecto devolvería el anterior)
        // runValidators: true -> aplica también las reglas del esquema al editar
        const servicio = await Servicio.findByIdAndUpdate(
            id,
            { nombre, descripcion, precio },
            { new: true, runValidators: true }
        );

        if (!servicio) {
            return resp.status(404).json({ ok: false, msg: 'No existe el servicio' });
        }

        return resp.status(200).json({
            ok: true,
            msg: 'Servicio modificado correctamente',
            servicio
        });

    } catch (error) {
        if (esIdMalFormado(error) || error.name === 'ValidationError') {
            return resp.status(400).json({ ok: false, msg: 'El id o algún dato no es válido' });
        }
        console.error(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error de servidor, póngase en contacto con el administrador'
        });
    }
};


// 5. DELETE /api/v1/servicios/:id -> eliminar un servicio
export const deleteAServiceById = async (req, resp) => {
    try {
        const id = req.params.id;

        // devuelve el documento eliminado o null si no existía
        const servicio = await Servicio.findByIdAndDelete(id);

        if (!servicio) {
            return resp.status(404).json({ ok: false, msg: 'No existe el servicio' });
        }

        return resp.status(200).json({
            ok: true,
            msg: 'Servicio eliminado correctamente',
            servicio
        });

    } catch (error) {
        if (esIdMalFormado(error)) {
            return resp.status(400).json({ ok: false, msg: 'El id no es válido' });
        }
        console.error(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error de servidor, póngase en contacto con el administrador'
        });
    }
};
