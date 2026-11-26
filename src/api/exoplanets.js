import { getJson } from './client.js';

// El TAP del Exoplanet Archive no envía cabeceras CORS: se consulta mediante
// el proxy interno (/api/exoplanetas) que existe en dev (Vite) y en producción (Vercel).
const TAP_URL = '/api/exoplanets';
const COLUMNS =
  'pl_name,hostname,disc_year,discoverymethod,pl_orbper,pl_rade,pl_bmasse,pl_eqt';

const METHODS = {
  Transit: 'Tránsito',
  'Radial Velocity': 'Velocidad radial',
  'Direct Imaging': 'Imagen directa',
  Microlensing: 'Microlente',
  'Transit Timing Variation': 'Variación del tiempo de tránsito',
};

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function translateMethod(method) {
  return METHODS[method] || method || 'Método desconocido';
}

export function formatTemperature(kelvin) {
  if (kelvin == null) return 'Sin dato';
  return `${Math.round(kelvin)} K · ~${Math.round(kelvin - 273)} °C`;
}

function normalize(row) {
  return {
    id: `${row.hostname || 'host'}-${row.pl_name || 'planet'}`,
    name: row.pl_name?.trim() || '',
    host: row.hostname || 'Estrella desconocida',
    year: toNumber(row.disc_year),
    method: translateMethod(row.discoverymethod),
    orbitalDays: toNumber(row.pl_orbper),
    radiusEarth: toNumber(row.pl_rade),
    massEarth: toNumber(row.pl_bmasse),
    tempK: toNumber(row.pl_eqt),
  };
}

export async function fetchExoplanets({ limit = 24, yearMin = 2018, signal } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 100);
  const safeYear = Math.min(Math.max(Number(yearMin) || 2018, 1990), 2026);
  const query =
    `SELECT TOP ${safeLimit} ${COLUMNS} FROM pscomppars ` +
    `WHERE disc_year >= ${safeYear} ORDER BY disc_year DESC`;

  const params = new URLSearchParams({ format: 'json', query });
  const rows = await getJson(`${TAP_URL}?${params}`, { signal });
  if (!Array.isArray(rows)) {
    throw new Error('El archivo de exoplanetas devolvió un formato inesperado.');
  }
  return rows.map(normalize).filter((planet) => planet.name);
}

export function findMostEarthLike(planets) {
  return planets
    .filter((planet) => planet.radiusEarth != null)
    .sort((a, b) => Math.abs(a.radiusEarth - 1) - Math.abs(b.radiusEarth - 1))[0] || null;
}
