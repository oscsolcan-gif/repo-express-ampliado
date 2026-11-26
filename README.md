# API REST de servicios y productos (Node.js, Express y MongoDB con Mongoose)

API REST básica para gestionar **servicios** (CRUD completo) y **productos** (listado). Práctica del bootcamp Full Stack. Rutas separadas, controladores con el patrón visto en clase y datos guardados en MongoDB con Mongoose.

## Puesta en marcha

1. Clonar el repositorio y entrar en la carpeta.
2. Instalar los paquetes: `npm install`
3. Copiar `.env.template` como `.env` y poner tus valores (el `.env` no se sube a GitHub).
4. Tener MongoDB encendido. En local, con Docker: `docker start some-mongo` (o crearlo con `docker run --name some-mongo -d -p 127.0.0.1:27017:27017 -v mongodatos:/data/db mongo`).
5. Arrancar: `npm start` (o `npm run dev` si tienes `nodemon`).

Si todo va bien, la consola dice **«Conectado a la bbdd»** y **«Servidor a la escucha del puerto 3000»**.

## Estructura

```
src/
  app.js                       servidor: helmet, lectores del cuerpo, rutas y arranque
  config/db-connect.js         conexión a MongoDB (async, try/catch)
  models/                      ServicioModel.js, ProductoModel.js (esquemas de Mongoose)
  routes/                      serviciosRoutes.js, productosRoutes.js
  controllers/                 serviciosController.js, productosController.js
```

## Variables de entorno

| Variable | Para qué | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor (Render lo pone solo) | `3000` |
| `URI` | Cadena de conexión a MongoDB | `mongodb://127.0.0.1:27017/express_ampliado` |

La base de **desarrollo** (local) y la de **producción** (Atlas) son distintas. En producción la `URI` se escribe en el panel de Render, nunca en el repositorio.

## Endpoints (prefijo `/api/v1`)

| Verbo | Ruta | Controlador | Respuestas |
|---|---|---|---|
| GET | `/api/v1/servicios` | `getAllServices` | 200 (array, vacío si no hay) · 500 |
| GET | `/api/v1/servicios/:id` | `getAServiceById` | 200 · 400 (id mal formado) · 404 · 500 |
| POST | `/api/v1/servicios` | `createAService` | 201 · 400 (faltan datos o tipo incorrecto) · 500 |
| PUT | `/api/v1/servicios/:id` | `updateAServiceById` | 200 · 400 · 404 · 500 |
| DELETE | `/api/v1/servicios/:id` | `deleteAServiceById` | 200 · 400 · 404 · 500 |
| GET | `/api/v1/productos` | `getAllProducts` | 200 (array) · 500 |

Todas las respuestas son JSON con `ok` (`true` o `false`) y `msg`.

### Ejemplo de Body (POST y PUT, `raw` + JSON en Postman)

```json
{
  "nombre": "Diseño web",
  "descripcion": "Hacemos tu página web",
  "precio": 300
}
```

## Despliegue en Render

Pendiente de hacer (lo pide el enunciado). Pasos previstos:
1. Crear un clúster y un usuario de base de datos en MongoDB Atlas (la contraseña, solo en Render).
2. En Render: *New Web Service* desde este repositorio de GitHub.
3. Build command `npm install` · Start command `npm start`.
4. Variables de entorno: `URI` (la de Atlas). `PORT` lo pone Render.
5. Comprobar con una petición a `/api/v1/servicios` (200 con la lista).
