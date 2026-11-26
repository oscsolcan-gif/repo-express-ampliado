// RUTAS DE SERVICIOS: qué verbo y qué camino van a qué controlador.
// En app.js se montan bajo /api/v1, así que aquí '/' es /api/v1/servicios.
// Regla de lectura: "ById" en el nombre del controlador <=> "/:id" en el camino.

import express from 'express';
import {
    getAllServices,
    getAServiceById,
    createAService,
    updateAServiceById,
    deleteAServiceById
} from '../controllers/serviciosController.js';

const router = express.Router();

// GET ALL SERVICES
router.get('/servicios', getAllServices);
// GET A SERVICE BY ID
router.get('/servicios/:id', getAServiceById);
// CREATE A SERVICE
router.post('/servicios', createAService);
// UPDATE A SERVICE BY ID
router.put('/servicios/:id', updateAServiceById);
// DELETE A SERVICE BY ID
router.delete('/servicios/:id', deleteAServiceById);

export default router;
