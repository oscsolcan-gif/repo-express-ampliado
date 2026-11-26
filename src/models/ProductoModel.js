// MODELO DE PRODUCTO: igual que el de servicio, con los mismos tres campos.
// El enunciado habla de "servicios y productos"; los campos del producto están por confirmar
// con el enunciado completo, así que se parte del mismo esquema.

import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true }
});

export const Producto = mongoose.model('Producto', productoSchema);
