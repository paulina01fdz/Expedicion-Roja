import Button from '../components/Button.jsx';

const STEPS = [
  {
    number: '01',
    title: 'Elige tu destino',
    text: 'Comienza en Marte o salta directo a los exoplanetas. Tú decides el orden del viaje.',
  },
  {
    number: '02',
    title: 'Recorre seis paradas',
    text: 'Cada parada explica un concepto con datos reales, una imagen y una pregunta breve.',
  },
  {
    number: '03',
    title: 'Gana tu insignia',
    text: 'Al completar el recorrido guardamos tu progreso y te entregamos tu credencial de explorador.',
  },
];

const DESTINATIONS = [
  {
    eyebrow: 'Destino 01',
    title: 'Marte',
    text: 'El planeta rojo, sus rovers y las pistas de agua que esconde su superficie.',
    image: '/assets/Images/pages/mars/mars-planet.webp',
    to: '/expedicion/marte',
    tone: 'mars',
  },
  {
    eyebrow: 'Destino 02',
    title: 'Exoplanetas',
    text: 'Mundos alrededor de otras estrellas: cómo se descubren y por qué son tan distintos.',
    image: '/assets/Images/pages/landing/planeta_morado.webp',
    to: '/expedicion/exoplanetas',
    tone: 'cosmos',
  },
];

export default function Home() {
  return (
    <>
      <div className="floating-astronaut" aria-hidden="true">
        <img
          src="/assets/Images/Astronauta.webp"
          alt=""
          width="216"
          height="184"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <section className="hero">
        <div className="hero__inner">
          <p className="eyebrow">Museo digital · Datos reales de la NASA</p>
          <h1>
            Expedición Roja <span>y Más Allá</span>
          </h1>
          <p className="hero__lead">
            Un viaje guiado por Marte y los exoplanetas para aprender de manera diferente. Seis paradas,
            imágenes reales y una insignia al final del recorrido.
          </p>
          <div className="hero__actions">
            <Button to="/expedicion" size="lg">
              Iniciar el recorrido
            </Button>
            <Button to="/archivo/exoplanetas" variant="ghost" size="lg">
              Explorar el archivo
            </Button>
          </div>
          <ul className="hero__facts">
            <li>
              <strong>6</strong> paradas guiadas
            </li>
            <li>
              <strong>2</strong> destinos
            </li>
            <li>
              <strong>100%</strong> datos reales
            </li>
          </ul>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <img
            className="hero__planet"
            src="/assets/Images/pages/landing/planeta_aro.webp"
            alt=""
            width="377"
            height="312"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className="section" aria-labelledby="como-funciona">
        <p className="eyebrow">Cómo funciona</p>
        <h2 id="como-funciona">Un museo en el que el recorrido se disfruta</h2>
        <div className="steps">
          {STEPS.map((step) => (
            <article className="step" key={step.number}>
              <span className="step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="destinos">
        <p className="eyebrow">Elige tu ruta</p>
        <h2 id="destinos">Dos destinos, un mismo viaje</h2>
        <div className="destinations">
          {DESTINATIONS.map((destination) => (
            <article className={`destination destination--${destination.tone}`} key={destination.title}>
              <div className="destination__image">
                <img src={destination.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="destination__body">
                <p className="eyebrow">{destination.eyebrow}</p>
                <h3>{destination.title}</h3>
                <p>{destination.text}</p>
                <Button to={destination.to} variant="ghost" size="sm">
                  Recorrer →
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--cta" aria-labelledby="aulas">
        <div>
          <p className="eyebrow">Para docentes y curiosos</p>
          <h2 id="aulas">Lleva el museo al aula</h2>
        </div>
        <Button to="/expedicion" variant="mars">
          Ver el recorrido
        </Button>
      </section>
    </>
  );
}