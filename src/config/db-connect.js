// CONEXIÓN A LA BASE DE DATOS: un módulo aparte que solo sabe conectar.
// Es "async": una función async SIEMPRE devuelve una promesa.
//   - Si todo va bien, la promesa se cumple con el texto del "return".
//   - Si falla, el "throw" la rechaza y quien la llamó lo recoge con ".catch".

import mongoose from 'mongoose';

export const dbConnect = async () => {

    try {
        // La dirección sale de la variable de entorno URI (.env en local, panel de Render en producción).
        // "await": esperamos a que Mongo responda antes de seguir.
        await mongoose.connect(process.env.URI);
        return 'Conectado a la bbdd';

    } catch (error) {
        // Lanzamos un Error de verdad (con pila) y guardamos el motivo original en "cause".
        // No metemos el motivo dentro del mensaje: así no se escapa a ninguna respuesta.
        throw new Error('No hay conexión con la base de datos', { cause: error });
    }

}
