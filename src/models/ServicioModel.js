// MODELO DE SERVICIO: dice qué campos tiene un servicio y de qué tipo.
// Mongoose crea la colección "servicios" (el nombre del modelo en minúsculas y en plural).
// El enunciado pide solo definir el modelo; no hace falta validación avanzada.

import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true }
});

export const Servicio = mongoose.model('Servicio', servicioSchema);
