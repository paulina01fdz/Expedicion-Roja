import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <div className="page section not-found">
      <p className="eyebrow">Señal perdida</p>
      <h1>Esta ruta no existe</h1>
      <p>El destino que buscas no está en el mapa de la expedición.</p>
      <Button to="/">Volver al inicio</Button>
    </div>
  );
}