import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import Starfield from './Starfield.jsx';
import { useExpedition, TOTAL_STOPS } from '../hooks/useExpedition.js';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/expedicion', label: 'El recorrido' },
  { to: '/archivo/exoplanetas', label: 'Exoplanetas' },
  { to: '/archivo/marte', label: 'Marte' },
];

export default function Layout({ children }) {
  const { completed, progress } = useExpedition();

  return (
    <>
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <Starfield />

      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand" aria-label="Expedición Roja, ir al inicio">
            <img src="/assets/Images/Logo.webp" alt="" width="34" height="34" decoding="async" />
            <span>
              Expedición <em>Roja</em>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Navegación principal">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/expedicion" className="header-progress" title="Ver mi progreso">
            <span>
              {completed.length}/{TOTAL_STOPS}
            </span>
            <span className="header-progress__bar" aria-hidden="true">
              <i style={{ width: `${progress}%` }} />
            </span>
          </Link>
        </div>
      </header>

      <main id="contenido" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p>
            <strong>Expedición Roja y Más Allá</strong> · museo digital para aprendeR
          </p>
          <p className="site-footer__note">
            Datos e imágenes: API NASA
          </p>
        </div>
      </footer>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
