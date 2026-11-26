const UPSTREAM = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
const TIMEOUT_MS = 12000;

/**
 * Proxy del Exoplanet Archive.
 * El servicio TAP no devuelve cabeceras CORS, así que el navegador no puede
 * consultarlo directamente. En producción esta función responde en /api/exoplanets.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  const query = typeof req.query?.query === 'string' ? req.query.query.trim() : '';
  if (!/^SELECT\s+TOP\s+\d+/i.test(query) || !/\bFROM\s+pscomppars\b/i.test(query)) {
    res.status(400).json({ error: 'Consulta no válida.' });
    return;
  }

  const url = new URL(UPSTREAM);
  url.searchParams.set('format', 'json');
  url.searchParams.set('query', query);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      res.status(502).json({ error: `El archivo respondió HTTP ${response.status}.` });
      return;
    }

    const rows = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(rows);
  } catch {
    res.status(502).json({ error: 'No se pudo contactar con el archivo de exoplanetas.' });
  } finally {
    clearTimeout(timer);
  }
}
