// RUTAS DE PRODUCTOS: por ahora solo traer todos. En app.js se montan bajo /api/v1.

import express from 'express';
import { getAllProducts } from '../controllers/productosController.js';

const router = express.Router();

// GET ALL PRODUCTS
router.get('/productos', getAllProducts);

export default router;
