// CONTROLADOR DE PRODUCTOS: por ahora solo traer todos (GET /api/v1/productos).
// El enunciado completo dirá si hace falta el CRUD entero; la plantilla es la de serviciosController.js.

import { Producto } from '../models/ProductoModel.js';

export const getAllProducts = async (req, resp) => {
    try {
        // find() devuelve siempre un array (vacío si no hay productos)
        const productos = await Producto.find();

        return resp.status(200).json({
            ok: true,
            msg: 'Productos obtenidos',
            productos
        });

    } catch (error) {
        console.error(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error de servidor, póngase en contacto con el administrador'
        });
    }
};
