import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import DataState from '../components/DataState.jsx';
import Modal from '../components/Modal.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { useExpedition } from '../hooks/useExpedition.js';
import {
  fetchExoplanets,
  findMostEarthLike,
  formatTemperature,
} from '../api/exoplanets.js';
import { loadMarsGallery } from '../api/mars.js';

const DESTINATIONS = {
  marte: {
    label: 'Expedición Roja',
    next: { to: '/expedicion/exoplanetas', label: 'Seguir hacia los exoplanetas' },
    key: 'tour-marte',
    loader: (signal) => loadMarsGallery({ sol: 1000, signal }),
    build: ({ photos = [] } = {}) => [
      {
        id: 'marte-1',
        eyebrow: 'Parada 1 de 3',
        title: '¿Por qué Marte es rojo?',
        body: 'Su superficie está cubierta de óxidos de hierro, el mismo mineral del óxido. La atmósfera es tan fina que la presión es menos del 1% de la terrestre.',
        image: '/assets/Images/pages/mars/mars-planet.webp',
        factLabel: 'Un día marciano',
        factValue: '24 h 37 min',
        question: '¿Qué le da a Marte su color rojizo?',
        options: ['Óxidos de hierro', 'Bosques de algas rojas', 'Una atmósfera de oxígeno'],
        answer: 0,
        explanation:
          'El polvo de óxido de hierro tiñe el suelo y se levanta en tormentas que pueden cubrir el planeta entero.',
      },
      {
        id: 'marte-2',
        eyebrow: 'Parada 2 de 3',
        title: 'El agua que ya no está',
        body: 'Hay cauces secos, deltas y minerales que solo se forman en presencia de agua. Marte fue mucho más húmedo hace miles de millones de años.',
        image: photos[0]?.full || '/assets/Images/pages/mars/fondo-paisaje-marte.webp',
        factLabel: 'Edad aproximada del terreno',
        factValue: 'Más de 3.000 millones de años',
        question: '¿Qué prueba nos dice que hubo agua?',
        options: ['Su color rojo', 'Cauces y minerales arcillosos', 'La baja temperatura actual'],
        answer: 1,
        explanation:
          'Los canales de erosión y las arcillas son huellas de agua líquida que existió en el pasado.',
      },
      {
        id: 'marte-3',
        eyebrow: 'Parada 3 de 3',
        title: 'Un ojo humano sobre el suelo',
        body: 'El rover Curiosity explora el cráter Gale desde 2012. Cada foto real que envía permite elegir la siguiente roca que analizará.',
        image: photos[Math.floor(photos.length / 2)]?.full || '/assets/Images/pages/mars/nave.webp',
        factLabel: 'Imágenes disponibles en esta carga',
        factValue: String(photos.length),
        question: '¿Para qué sirve un rover?',
        options: [
          'Para transportar personas a Marte',
          'Para estudiar el suelo y el clima en el lugar',
          'Para fabricar combustible en la Luna',
        ],
        answer: 1,
        explanation:
          'Los rovers son laboratorios móviles: se desplazan, fotografían y analizan muestras con sus instrumentos.',
      },
    ],
  },
  exoplanetas: {
    label: 'Más Allá',
    next: { to: '/archivo/exoplanetas', label: 'Explorar el archivo completo' },
    key: 'tour-exoplanetas',
    loader: (signal) => fetchExoplanets({ limit: 30, yearMin: 2015, signal }),
    build: (planets = []) => {
      const withPeriod = planets.find((planet) => planet.orbitalDays != null);
      const earthLike = findMostEarthLike(planets);
      return [
        {
          id: 'exo-1',
          eyebrow: 'Parada 1 de 3',
          title: 'Un mundo alrededor de otra estrella',
          body: 'Un exoplaneta orbita una estrella que no es el Sol. Los hay gigantes gaseosos, rocas calientes y mundos de tamaños intermedios.',
          image: '/assets/Images/pages/landing/planeta_morado.webp',
          factLabel: 'Exoplanetas confirmados',
          factValue: 'Más de 5.000',
          question: '¿Dónde se encuentra un exoplaneta?',
          options: ['Fuera del Sistema Solar', 'En la órbita de la Luna', 'Bajo la corteza terrestre'],
          answer: 0,
          explanation:
            'Se llama exoplaneta a cualquier planeta que orbita una estrella ajena a nuestro Sistema Solar.',
        },
        {
          id: 'exo-2',
          eyebrow: 'Parada 2 de 3',
          title: 'El año de otro mundo',
          body: 'El período orbital es el tiempo que tarda un planeta en dar una vuelta completa a su estrella. Es su "año", y puede durar desde horas hasta siglos.',
          image: '/assets/Images/pages/landing/planeta_azul.webp',
          factLabel: withPeriod ? `Año de ${withPeriod.name}` : 'Período orbital',
          factValue: withPeriod
            ? `${Math.round(withPeriod.orbitalDays)} días terrestres`
            : 'Sin dato disponible',
          question: '¿Qué describe el período orbital?',
          options: [
            'El tiempo que tarda en girar sobre sí mismo',
            'El tiempo que tarda en orbitar su estrella',
            'El tiempo que tarda en enfriarse',
          ],
          answer: 1,
          explanation:
            'Girar sobre sí mismo es el día; dar una vuelta a la estrella es el año. No son lo mismo.',
        },
        {
          id: 'exo-3',
          eyebrow: 'Parada 3 de 3',
          title: '¿Parecido a la Tierra?',
          body: 'Comparar radios es un primer paso, pero la habitabilidad también depende de la distancia a su estrella, la atmósfera y la actividad estelar.',
          image: '/assets/Images/pages/mars/earth.webp',
          factLabel: earthLike ? `Más parecido: ${earthLike.name}` : 'Planeta más parecido',
          factValue: earthLike?.radiusEarth
            ? `${earthLike.radiusEarth.toFixed(2)} radios terrestres`
            : 'Sin dato disponible',
          question: '¿Un planeta del tamaño de la Tierra es habitable?',
          options: [
            'Sí, siempre',
            'No, nunca',
            'No necesariamente: depende de su estrella y su atmósfera',
          ],
          answer: 2,
          explanation:
            `El tamaño es solo una pista. La temperatura estimada de ${earthLike ? formatTemperature(earthLike.tempK) : 'este planeta'} muestra por qué hace falta más información.`,
        },
      ];
    },
  },
};

export default function Tour() {
  const { destino } = useParams();
  const config = DESTINATIONS[destino];
  const query = useApiData(
    config?.key ?? 'tour-desconocido',
    config?.loader ?? (() => Promise.resolve([])),
    { enabled: Boolean(config) },
  );

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const { complete } = useExpedition();

  useEffect(() => {
    setStep(0);
    setSelected(null);
    setShowBadge(false);
  }, [destino]);

  const stops = useMemo(() => {
    if (!config || !query.data) return [];
    const hasValidData =
      destino === 'marte'
        ? Array.isArray(query.data.photos)
        : Array.isArray(query.data);
    return hasValidData ? config.build(query.data) : [];
  }, [config, query.data, destino]);

  if (!config) {
    return (
      <div className="page section">
        <h1>Destino desconocido</h1>
        <p>Ese destino no existe en la expedición.</p>
        <Button to="/expedicion">Volver al recorrido</Button>
      </div>
    );
  }

  const stop = stops[step];
  const answered = selected !== null;
  const isCorrect = selected === stop?.answer;

  const handleNext = () => {
    if (!stop) return;
    complete(stop.id);
    if (step < stops.length - 1) {
      setStep(step + 1);
      setSelected(null);
    } else {
      stops.forEach((item) => complete(item.id));
      setShowBadge(true);
    }
  };

  return (
    <div className="page tour">
      <div className="tour__top">
        <div>
          <p className="eyebrow">{config.label}</p>
          <h1>Recorrido guiado</h1>
        </div>
        <Button to="/expedicion" variant="ghost" size="sm">
          Cambiar de ruta
        </Button>
      </div>

      <div className="tour__progress" aria-hidden="true">
        <i style={{ width: `${stops.length ? ((step + 1) / stops.length) * 100 : 0}%` }} />
      </div>

      <DataState
        loading={query.loading}
        error={query.error}
        empty={!stop}
        onRetry={query.refetch}
      >
        {stop && (
          <>
            {query.data?.warning && <p className="notice">{query.data.warning}</p>}

            <article className="stop">
              <div className="stop__media">
                <img src={stop.image} alt="" loading="lazy" decoding="async" />
                <span className="stop__badge">{stop.eyebrow}</span>
              </div>

              <div className="stop__content">
                <h2>{stop.title}</h2>
                <p className="stop__body">{stop.body}</p>

                <div className="stop__fact">
                  <span>{stop.factLabel}</span>
                  <strong>{stop.factValue}</strong>
                </div>

                <fieldset className="quiz" disabled={answered}>
                  <legend>{stop.question}</legend>
                  {stop.options.map((option, index) => (
                    <label
                      key={option}
                      className={`quiz__option${selected === index ? ' is-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`pregunta-${stop.id}`}
                        value={index}
                        checked={selected === index}
                        onChange={() => setSelected(index)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>

                {answered && (
                  <div
                    className={`quiz__feedback${isCorrect ? ' is-correct' : ' is-incorrect'}`}
                    role="status"
                  >
                    <strong>{isCorrect ? '¡Correcto!' : 'Casi:'}</strong> {stop.explanation}
                  </div>
                )}

                <div className="stop__actions">
                  <Button onClick={handleNext} disabled={!answered} variant="mars">
                    {step === stops.length - 1 ? 'Ver mi insignia' : 'Siguiente parada →'}
                  </Button>
                  <Link className="link-button" to={`/archivo/${destino === 'marte' ? 'marte' : 'exoplanetas'}`}>
                    Ver datos y fotos
                  </Link>
                </div>
              </div>
            </article>
          </>
        )}
      </DataState>

      <Modal open={showBadge} onClose={() => setShowBadge(false)} title="¡Expedición completada!">
        <div className="badge">
          <img src="/assets/Images/pages/landing/planeta_aro.webp" alt="" decoding="async" />
          <h3>Explorador de {config.label}</h3>
          <p>
            Completaste las tres paradas de esta ruta. Tu progreso queda guardado en este
            navegador para cuando vuelvas.
          </p>
          <div className="badge__actions">
            <Button to={config.next.to} size="sm">
              {config.next.label}
            </Button>
            <Button onClick={() => setShowBadge(false)} variant="ghost" size="sm">
              Seguir explorando
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
