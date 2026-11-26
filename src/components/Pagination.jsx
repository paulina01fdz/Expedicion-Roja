import PropTypes from 'prop-types';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const visible = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === totalPages || Math.abs(number - page) <= 1,
  );

  return (
    <nav className="pagination" aria-label="Paginación de resultados">
      <button
        type="button"
        className="pagination__arrow"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        ←
      </button>
      {visible.map((number, index) => (
        <span key={number}>
          {index > 0 && number - visible[index - 1] > 1 && (
            <span className="pagination__dots" aria-hidden="true">
              …
            </span>
          )}
          <button
            type="button"
            className={`pagination__number${number === page ? ' is-current' : ''}`}
            onClick={() => onChange(number)}
            aria-current={number === page ? 'page' : undefined}
            aria-label={`Página ${number}`}
          >
            {number}
          </button>
        </span>
      ))}
      <button
        type="button"
        className="pagination__arrow"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
      >
        →
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
