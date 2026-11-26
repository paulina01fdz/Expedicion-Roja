import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Expedition from './pages/Expedition.jsx';
import Tour from './pages/Tour.jsx';
import ExoplanetArchive from './pages/ExoplanetArchive.jsx';
import MarsArchive from './pages/MarsArchive.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expedicion" element={<Expedition />} />
        <Route path="/expedicion/:destino" element={<Tour />} />
        <Route path="/archivo/exoplanetas" element={<ExoplanetArchive />} />
        <Route path="/archivo/marte" element={<MarsArchive />} />

        {/* Rutas antiguas: redirección para no romper enlaces guardados */}
        <Route path="/Mars" element={<Navigate to="/expedicion/marte" replace />} />
        <Route path="/Mars-gallery" element={<Navigate to="/archivo/marte" replace />} />
        <Route path="/Exoplanets" element={<Navigate to="/expedicion/exoplanetas" replace />} />
        <Route path="/Exoplanets-gallery" element={<Navigate to="/archivo/exoplanetas" replace />} />
        <Route path="/Exoplanets-data" element={<Navigate to="/archivo/exoplanetas" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
