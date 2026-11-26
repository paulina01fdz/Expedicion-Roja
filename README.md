# Expedición Roja y Más Allá

Museo digital interactivo para recorrer **Marte** y los **exoplanetas** con datos reales de la NASA.
El producto es un viaje guiado de seis paradas: cada parada explica un concepto, muestra una imagen
real y termina con una pregunta breve. El progreso se guarda en el navegador y termina en una insignia.

> Proyecto educativo.

## Stack

- React 18 + Vite 5
- React Router 6
- CSS
- `fetch` nativo (sin axios ni Redux);

## Puesta en marcha

```bash
npm install
npm run dev
```

Verificación completa:

```bash
npm run check   # lint + build
```


## Fuentes de datos

| Fuente | URL | Key |
| --- | --- | --- |
| Galería de imágenes de la NASA | `https://images-api.nasa.gov/search` | No |
| Fotos del rover Curiosity | `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos` | Sí |

Si la API de rovers falla (cuota agotada o sol sin fotos), la galería de Marte usa imágenes del
archivo de la NASA y lo indica con un aviso visible.

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
