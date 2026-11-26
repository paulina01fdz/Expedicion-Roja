import { useState } from 'react';
import Button from '../components/Button.jsx';
import DataState from '../components/DataState.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { loadMarsGallery } from '../api/mars.js';

const PAGE_SIZE = 9;

export default function MarsArchive() {
  const [sol, setSol] = useState(1000);
  const [draftSol, setDraftSol] = useState('1000');
  const [page, setPage] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  const gallery = useApiData(`archivo-marte-${sol}`, (signal) =>
    loadMarsGallery({ sol, signal }),
  );

  const photos = gallery.data?.photos || [];
  const totalPages = Math.ceil(photos.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visible = photos.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = Number(draftSol);
    if (!Number.isFinite(next) || next < 1) return;
    setSol(Math.min(Math.round(next), 5000));
    setPage(1);
  };

  return (
    <div className="page section">
      <p className="eyebrow">Archivo · En vivo</p>
      <h1>Galería de Marte</h1>
      <p className="section__lead">
        Fotografías tomadas por el rover Curiosity. Elige un sol marciano para cambiar la colección.
      </p>

      <form className="sol-form" onSubmit={handleSubmit}>
        <label htmlFor="sol">Sol marciano (día en Marte)</label>
        <div>
          <input
            id="sol"
            type="number"
            min="1"
            max="5000"
            value={draftSol}
            onChange={(event) => setDraftSol(event.target.value)}
          />
          <Button type="submit" size="sm">
            Buscar
          </Button>
        </div>
      </form>

      {gallery.data?.warning && <p className="notice">{gallery.data.warning}</p>}
      {gallery.data?.source === 'rover' && (
        <p className="archive-note">Mostrando fotos del sol {gallery.data.sol}.</p>
      )}

      <DataState
        loading={gallery.loading}
        error={gallery.error}
        empty={!gallery.loading && visible.length === 0}
        onRetry={gallery.refetch}
      >
        <div className="image-grid">
          {visible.map((photo) => (
            <button
              type="button"
              className="image-card"
              key={photo.id}
              onClick={() => setActiveImage(photo)}
              aria-label={`Ver detalle de ${photo.title}`}
            >
              <img src={photo.thumb} alt="" loading="lazy" decoding="async" />
              <span>{photo.title}</span>
            </button>
          ))}
        </div>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </DataState>

      <div className="archive-footer">
        <Button to="/expedicion/marte" variant="ghost" size="sm">
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
              <small>{activeImage.creator}</small>
            </figcaption>
          </figure>
        )}
      </Modal>
    </div>
  );
}