import Button from '../components/Button.jsx';
import { useExpedition, TOTAL_STOPS } from '../hooks/useExpedition.js';

const ROUTES = [
  {
    title: 'Expedición Roja',
    eyebrow: 'Ruta 01 · 3 paradas',
    text: 'Marte desde el planeta rojo hasta las fotos tomadas por el rover Curiosity.',
    to: '/expedicion/marte',
    image: '/assets/Images/pages/mars/fondo-paisaje-marte.webp',
  },
  {
    title: 'Más Allá',
    eyebrow: 'Ruta 02 · 3 paradas',
    text: 'Qué son los exoplanetas, cómo se descubren y cuál se parece más a la Tierra.',
    to: '/expedicion/exoplanetas',
    image: '/assets/Images/pages/landing/planeta_aro.webp',
  },
];

export default function Expedition() {
  const { completed, progress, reset } = useExpedition();

  return (
    <div className="page section">
      <p className="eyebrow">El recorrido</p>
      <h1>Tu expedición empieza aquí</h1>
      <p className="section__lead">
        Elige una ruta y avanza parada por parada. Tu progreso se guarda en este navegador.
      </p>

      <div className="expedition-progress">
        <div className="expedition-progress__meta">
          <span>Progreso de la expedición</span>
          <strong>
            {completed.length} de {TOTAL_STOPS} paradas
          </strong>
        </div>
        <div className="expedition-progress__track">
          <i style={{ width: `${progress}%` }} />
        </div>
        {completed.length > 0 && (
          <button type="button" className="link-button" onClick={reset}>
            Reiniciar progreso
          </button>
        )}
      </div>

      <div className="routes">
        {ROUTES.map((route) => (
          <article className="route-card" key={route.title}>
            <div className="route-card__image">
              <img src={route.image} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="route-card__body">
              <p className="eyebrow">{route.eyebrow}</p>
              <h2>{route.title}</h2>
              <p>{route.text}</p>
              <Button to={route.to} size="sm">
                Empezar ruta
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}