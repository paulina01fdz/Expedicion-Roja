import { useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import DataState from '../components/DataState.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { fetchExoplanets, formatTemperature } from '../api/exoplanets.js';
import { fetchNasaImages } from '../api/nasaImages.js';

const PAGE_SIZE = 9;

export default function ExoplanetArchive() {
  const [tab, setTab] = useState('datos');
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('todos');
  const [page, setPage] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  const planets = useApiData(
    'archivo-exoplanetas',
    (signal) => fetchExoplanets({ limit: 60, yearMin: 2015, signal }),
    { enabled: tab === 'datos' },
  );
  const images = useApiData(
    'archivo-exoplanetas-imagenes',
    (signal) => fetchNasaImages({ q: 'exoplanet', pageSize: 18, signal }),
    { enabled: tab === 'imagenes' },
  );

  const years = useMemo(
    () => [...new Set((planets.data || []).map((planet) => planet.year).filter(Boolean))].sort((a, b) => b - a),
    [planets.data],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (planets.data || []).filter((planet) => {
      const matchesText =
        !normalized ||
        planet.name.toLowerCase().includes(normalized) ||
        planet.host.toLowerCase().includes(normalized);
      const matchesYear = year === 'todos' || String(planet.year) === year;
      return matchesText && matchesYear;
    });
  }, [planets.data, query, year]);

  const activeState = tab === 'datos' ? planets : images;
  const list = tab === 'datos' ? filtered : images.data || [];
  const totalPages = Math.ceil(list.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visible = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="page section">
      <p className="eyebrow">Archivo · En vivo</p>
      <h1>Exoplanetas</h1>
      <p className="section__lead">
        Mundos confirmados por el Exoplanet Archive del IPAC/Caltech y arte conceptual de la NASA.
      </p>

      <div className="tabs" role="tablist" aria-label="Vistas del archivo">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'datos'}
          className={tab === 'datos' ? 'is-active' : ''}
          onClick={() => setTab('datos')}
        >
          Datos científicos
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'imagenes'}
          className={tab === 'imagenes' ? 'is-active' : ''}
          onClick={() => setTab('imagenes')}
        >
          Imágenes de la NASA
        </button>
      </div>

      {tab === 'datos' && (
        <div className="filters">
          <label>
            Buscar planeta o estrella
            <input
              type="search"
              value={query}
              placeholder="Ej. Kepler, TOI-1758…"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <label>
            Año de descubrimiento
            <select
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
                setPage(1);
              }}
            >
              <option value="todos">Todos</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <DataState
        loading={activeState.loading}
        error={activeState.error}
        empty={!activeState.loading && list.length === 0}
        onRetry={activeState.refetch}
      >
        {tab === 'datos' ? (
          <div className="data-grid">
            {visible.map((planet) => (
              <article className="data-card" key={planet.id}>
                <p className="data-card__eyebrow">Descubierto en {planet.year || '—'}</p>
                <h2>{planet.name}</h2>
                <dl>
                  <div>
                    <dt>Estrella</dt>
                    <dd>{planet.host}</dd>
                  </div>
                  <div>
                    <dt>Método</dt>
                    <dd>{planet.method}</dd>
                  </div>
                  <div>
                    <dt>Año orbital</dt>
                    <dd>
                      {planet.orbitalDays != null
                        ? `${planet.orbitalDays.toFixed(1)} días`
                        : 'Sin dato'}
                    </dd>
                  </div>
                  <div>
                    <dt>Radio</dt>
                    <dd>
                      {planet.radiusEarth != null
                        ? `${planet.radiusEarth.toFixed(2)} Tierra`
                        : 'Sin dato'}
                    </dd>
                  </div>
                  <div>
                    <dt>Temperatura</dt>
                    <dd>{formatTemperature(planet.tempK)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <div className="image-grid">
            {visible.map((image) => (
              <button
                type="button"
                className="image-card"
                key={image.id}
                onClick={() => setActiveImage(image)}
                aria-label={`Ver detalle de ${image.title}`}
              >
                <img src={image.thumb} alt="" loading="lazy" decoding="async" />
                <span>{image.title}</span>
              </button>
            ))}
          </div>
        )}

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </DataState>

      <div className="archive-footer">
        <Button to="/expedicion/exoplanetas" variant="ghost" size="sm">
          ← Volver al recorrido
        </Button>
      </div>

      <Modal
        open={Boolean(activeImage)}
        onClose={() => setActiveImage(null)}
        title={activeImage?.title || ''}
      >
        {activeImage && (
          <figure className="image-detail">
            <img src={activeImage.full || activeImage.thumb} alt={activeImage.title} decoding="async" />
            <figcaption>
              <p>{activeImage.description}</p>
              <small>
                {activeImage.creator}
                {activeImage.date ? ` · ${new Date(activeImage.date).getFullYear()}` : ''}
              </small>
            </figcaption>
          </figure>
        )}
      </Modal>
    </div>
  );
}