import { buildUrl, getJson } from './client.js';

const IMAGES_URL = 'https://images-api.nasa.gov/search';

export async function fetchNasaImages({ q, pageSize = 12, page = 1, signal } = {}) {
  const payload = await getJson(
    buildUrl(IMAGES_URL, {
      q,
      media_type: 'image',
      page_size: pageSize,
      page,
    }),
    { signal },
  );

  const items = payload?.collection?.items;
  if (!Array.isArray(items)) {
    throw new Error('La galería de la NASA devolvió un formato inesperado.');
  }

  return items
    .map((item, index) => {
      const data = item.data?.[0] || {};
      const links = item.links || [];
      const pick = (relation) =>
        links.find((link) => link.rel === relation)?.href || links[0]?.href || null;

      return {
        id: data.nasa_id || `${q}-${index}`,
        title: data.title || 'Imagen de la NASA',
        description: data.description || '',
        creator: data.secondary_creator || data.center || 'NASA',
        date: data.date_created || null,
        thumb: pick('preview') || pick('alternate'),
        full: pick('canonical') || pick('large') || pick('alternate'),
      };
    })
    .filter((image) => image.thumb);
}
