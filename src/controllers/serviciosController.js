// CONTROLADOR DE SERVICIOS: los 5 endpoints del CRUD (crear, leer todos, leer uno, editar y borrar).
// Los nombres siguen la regla de clase: acción + cuántos + recurso + "ById" si el camino lleva /:id.
// Cada función recibe req (lo que pide quien llama) y resp (lo que le contestamos).
//
// Reglas que se repiten en TODAS (y por qué):
//   - Todo lo asíncrono va con await dentro de try/catch: hablar con la base tarda, y si falla
//     no queremos que el servidor se caiga, sino contestar un error controlado.
//   - Cada rama termina en una respuesta con "return": si se olvida, el código sigue
//     y acaba intentando contestar dos veces.
//   - Un error 4xx o 5xx lleva ok: false y un éxito, ok: true (convención del curso).
//   - Al cliente NUNCA se le manda el objeto "error": puede llevar rutas, consultas o datos
//     internos. El detalle va a la consola del servidor (console.error) y al cliente, un mensaje genérico.

import { Servicio } from '../models/ServicioModel.js';

// Un id de MongoDB mal formado (por ejemplo "abc") hace que Mongoose lance un CastError.
// Es un fallo de quien llama, no del servidor: por eso se contesta 400 y no 500.
const esIdMalFormado = (error) => error.name === 'CastError';


// 1. GET /api/v1/servicios -> todos los servicios
export const getAllServices = async (req, resp) => {
    try {
        // find() sin filtro trae todos. Devuelve SIEMPRE un array: si no hay servicios,
        // un array vacío [] (nunca null). Por eso aquí no hace falta una rama 404:
        // una lista vacía es una respuesta correcta (200), no un error.
        const servicios = await Servicio.find();

        return resp.status(200).json({
            ok: true,
            msg: 'Servicios obtenidos',
            servicios
        });

    } catch (error) {
        // Solo llegamos aquí si falla algo inesperado (por ejemplo, la base de datos cae): 500
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
        // El :id de la ruta llega en req.params (siempre como texto)
        const id = req.params.id;

        // findById devuelve el documento, o null si no existe. A diferencia de find,
        // aquí SÍ hay que comprobar el null: si no, contestaríamos 200 con un servicio vacío.
        const servicio = await Servicio.findById(id);

        // Denegar primero: no existe -> 404 y return (la petición no sigue)
        if (!servicio) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el servicio'
            });
        }

        // Camino bueno, al final
        return resp.status(200).json({
            ok: true,
            msg: 'Servicio obtenido',
            servicio
        });

    } catch (error) {
        // Un id con formato imposible (no son los 24 caracteres de un ObjectId) lanza CastError:
        // lo ha mandado mal quien llama -> 400
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
        // Los datos llegan en el cuerpo de la petición. Los desestructuramos para quedarnos
        // solo con los tres que nos interesan. "?? {}": en Express 5, si no llega cuerpo,
        // req.body es undefined y desestructurarlo rompería (daría 500 en vez de 400).
        const { nombre, descripcion, precio } = req.body ?? {};

        // Primero lo que se deniega: si falta algún dato, 400 y return.
        // precio se compara con undefined (y no con !precio) porque un precio 0 sería válido.
        if (!nombre || !descripcion || precio === undefined) {
            return resp.status(400).json({
                ok: false,
                msg: 'Faltan datos: nombre, descripcion y precio son obligatorios'
            });
        }

        // Solo guardamos los tres campos del esquema (no pasamos req.body entero):
        // así nadie puede colarnos campos que no esperamos (por ejemplo "esAdmin").
        // Mongoose aplica ahora las reglas del esquema (tipos, required, trim).
        const servicio = await Servicio.create({ nombre, descripcion, precio });

        // 201 = creado (RFC 9110 §9.3.3). En clase se contesta 200; la documentación dice 201.
        return resp.status(201).json({
            ok: true,
            msg: 'Servicio creado correctamente',
            servicio
        });

    } catch (error) {
        // ValidationError: llegó un dato con tipo incorrecto (precio "abc") o vacío (nombre "   ").
        // Lo ha mandado mal quien llama -> 400 y no 500.
        if (error.name === 'ValidationError') {
            return resp.status(400).json({ ok: false, msg: 'Algún dato no es válido: revisa que no estén vacíos y que el precio sea un número' });
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

        // Si no llega ningún campo, no hay nada que modificar: 400
        if (nombre === undefined && descripcion === undefined && precio === undefined) {
            return resp.status(400).json({
                ok: false,
                msg: 'No hay nada que modificar: envía nombre, descripcion o precio'
            });
        }

        // new: true -> devuelve el documento YA modificado (por defecto devolvería el anterior).
        // runValidators: true -> aplica también las reglas del esquema al editar
        //   (por defecto Mongoose solo las aplica al crear, no al editar).
        // Los campos que llegan undefined no se tocan: Mongoose los ignora.
        const servicio = await Servicio.findByIdAndUpdate(
            id,
            { nombre, descripcion, precio },
            { new: true, runValidators: true }
        );

        // null = no existe ese id -> 404
        if (!servicio) {
            return resp.status(404).json({ ok: false, msg: 'No existe el servicio' });
        }

        return resp.status(200).json({
            ok: true,
            msg: 'Servicio modificado correctamente',
            servicio
        });

    } catch (error) {
        // CastError (id mal formado) o ValidationError (dato inválido): los dos son culpa de quien llama
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

        // Devuelve el documento eliminado, o null si no existía.
        // Gracias a eso, borrar dos veces lo mismo da 404 la segunda y no un falso "borrado".
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
