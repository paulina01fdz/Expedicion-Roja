# Expedición Roja y Más Allá

Museo digital interactivo para recorrer **Marte** y los **exoplanetas** con datos reales de la NASA.
El producto es un viaje guiado de seis paradas: cada parada explica un concepto, muestra una imagen
real y termina con una pregunta breve. El progreso se guarda en el navegador y termina en una insignia.

> Proyecto educativo independiente. No afiliado a la NASA.

## Stack

- React 18 + Vite 5
- React Router 6
- CSS propio con tokens de diseño (sin MUI, sin Emotion)
- `fetch` nativo (sin axios ni Redux); el archivo de exoplanetas usa un proxy interno porque el TAP de IPAC no permite CORS

## Puesta en marcha

```bash
npm install
cp .env.example .env   # opcional: la app funciona con DEMO_KEY
npm run dev
```

Verificación completa:

```bash
npm run check   # lint + build
```

## Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `VITE_NASA_API_KEY` | No | Fotos del rover Curiosity. Por defecto `DEMO_KEY` (~30 peticiones/hora por IP). |

**Importante:** cualquier variable `VITE_*` se incluye en el JavaScript que descarga el visitante.
No uses una key privada aquí. Para producción, crea una función serverless que guarde la key y
haga de proxy; el cliente debe llamar a esa función.

## Fuentes de datos

| Fuente | URL | Key |
| --- | --- | --- |
| Exoplanet Archive (IPAC/Caltech) | `https://exoplanetarchive.ipac.caltech.edu/TAP/sync` | No |
| Galería de imágenes de la NASA | `https://images-api.nasa.gov/search` | No |
| Fotos del rover Curiosity | `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos` | Sí |

Si la API de rovers falla (cuota agotada o sol sin fotos), la galería de Marte usa imágenes del
archivo de la NASA y lo indica con un aviso visible.

El TAP de exoplanetas no envía cabeceras CORS, por eso se consulta en `/api/exoplanets`: Vite hace
de proxy en desarrollo y `api/exoplanets.js` atiende esa ruta en Vercel. Las imágenes locales están
optimizadas en WebP y se cargan con `loading="lazy"` fuera de la portada.

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Portada y selección de ruta |
| `/expedicion` | Mapa del recorrido y progreso |
| `/expedicion/marte` | Ruta guiada por Marte |
| `/expedicion/exoplanetas` | Ruta guiada por exoplanetas |
| `/archivo/marte` | Galería por sol marciano |
| `/archivo/exoplanetas` | Datos filtrables y arte conceptual |

Las rutas antiguas (`/Mars`, `/Mars-gallery`, `/Exoplanets`, etc.) redirigen a las nuevas.

## Estructura

```
src/
  api/        cliente HTTP, exoplanetas, Marte e imágenes
  components/ Layout, Starfield, Button, Modal, Pagination, DataState
  hooks/      useApiData (caché + abort + retry) y useExpedition (progreso)
  pages/      Home, Expedition, Tour, archivos y 404
  styles/     tokens, global y componentes
```
