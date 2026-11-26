import { buildUrl, getJson } from './client.js';
import { fetchNasaImages } from './nasaImages.js';

const PHOTOS_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos';
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

function normalizeRoverPhoto(photo) {
  return {
    id: String(photo.id),
    title: `${photo.camera?.full_name || 'Cámara del rover'} · Sol ${photo.sol}`,
    description: `Imagen capturada por ${photo.rover?.name || 'Curiosity'} el ${photo.earth_date || 'una fecha desconocida'}.`,
    creator: 'NASA / JPL-Caltech',
    date: photo.earth_date || null,
    thumb: photo.img_src,
    full: photo.img_src,
  };
}

async function fetchRoverPhotos({ sol, page, signal }) {
  const url = buildUrl(PHOTOS_URL, {
    api_key: API_KEY,
    sol,
    page,
  });
  const payload = await getJson(url, { signal });
  if (!Array.isArray(payload?.photos)) {
    throw new Error('La API de rovers devolvió un formato inesperado.');
  }
  return payload.photos.map(normalizeRoverPhoto);
}

/**
 * La API de fotos de rovers suele fallar por cuota de DEMO_KEY o por soles sin fotos.
 * Si ocurre, caemos al archivo de imágenes de la NASA para que la galería nunca quede vacía.
 */
export async function loadMarsGallery({ sol = 1000, page = 1, signal } = {}) {
  const safeSol = Math.min(Math.max(Number(sol) || 1000, 1), 5000);

  try {
    const photos = await fetchRoverPhotos({ sol: safeSol, page, signal });
    if (photos.length > 0) {
      return { source: 'rover', sol: safeSol, photos, warning: null };
    }
  } catch (error) {
    if (signal?.aborted) throw error;
  }

  const photos = await fetchNasaImages({
    q: 'curiosity rover mars',
    pageSize: 18,
    page,
    signal,
  });
  return {
    source: 'images',
    sol: null,
    photos,
    warning:
      'Las fotos del rover no estaban disponibles en este momento. Mostramos imágenes verificadas del archivo de la NASA.',
  };
}
