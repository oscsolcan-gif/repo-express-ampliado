// SERVIDOR: carga la configuración, conecta con la base de datos, monta las rutas y escucha.

// 1. Primero cargamos las variables del .env (así lo indica el LEEME de dotenv)
import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
// 2. Primero los paquetes externos, después los nuestros (convención, no regla del lenguaje)
import serviciosRoutes from './routes/serviciosRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import { dbConnect } from './config/db-connect.js';

const app = express();

// 3. Cabeceras de seguridad. Va arriba, antes de las rutas: el orden de carga manda.
app.use(helmet());

// 4. El puerto: el del .env o de Render (variable PORT) y, si no hay, el 3000
const port = process.env.PORT || 3000;

// 5. Lectores del cuerpo. Sin ellos, en Express 5 req.body vale undefined.
//    json -> lo que manda Postman o fetch con application/json
//    urlencoded -> lo que manda un <form> normal de HTML
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 7. Primero la base de datos; solo si conecta, abrimos la puerta del servidor.
//    Si no conecta, avisamos y paramos: un servidor sin base de datos no sirve de nada.
dbConnect()
    .then((mensaje) => {
        console.log(mensaje);
    })
    .catch((error) => {
        // Si la conexión falla, mostramos el aviso (y el motivo original, guardado en "cause")
        // en la consola del servidor, nunca en una respuesta HTTP.
        console.error(error.message, error.cause?.message ?? '');
        // process.exit(1): terminar con código 1 significa "terminó con error". Así Render
        // (o quien lance el servidor) sabe que algo falló y no cree que está funcionando.
        process.exit(1);
    });

// 6. Rutas, todas bajo el prefijo /api/v1
app.use('/api/v1', serviciosRoutes);
//app.use('/api/v1', productosRoutes); 


app.listen(port, () => {
            console.log(`Servidor a la escucha del puerto ${port}`);
        });