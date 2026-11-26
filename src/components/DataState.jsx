import PropTypes from 'prop-types';
import Button from './Button.jsx';

export default function DataState({ loading, error, empty, onRetry, children }) {
  if (loading) {
    return (
      <div className="state" role="status">
        <span className="state__spinner" aria-hidden="true" />
        <p>Cargando datos reales de la NASA…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state state--error" role="alert">
        <h3>No pudimos cargar esta sección</h3>
        <p>{error.message || 'Ha ocurrido un error inesperado.'}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm">
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="state">
        <h3>Sin resultados</h3>
        <p>Prueba con otros filtros o vuelve a intentarlo más tarde.</p>
      </div>
    );
  }

  return children;
}

DataState.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  empty: PropTypes.bool,
  onRetry: PropTypes.func,
  children: PropTypes.node,
};
