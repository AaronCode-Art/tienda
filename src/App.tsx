// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProductosPage from './pages/productos/ProductosPage'; 
import ProductoporCatalogo from './pages/productoporcatalogo/ProductoporCatalogo';
import NosotrosPages from './pages/nosotros/NosotrosPages';
import ContactoPage from './pages/contactos/ContactoPage';
import DetalleProductoPage from './pages/detalle/DetalleProductoPage';

// Importamos tus páginas y componentes
import InicioPage from './pages/inicio/InicioPage';
// Nota: Aquí irás importando las demás páginas cuando las crees (Login, Productos, etc.)

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      {/* Si quieres que el Encabezado sea global, podrías ponerlo aquí,
        pero como ya lo incluiste dentro de InicioPage, por ahora
        dejaremos que cada página maneje su estructura.
      */}
      <Routes>
        {/* Ruta principal: Inicio */}
        <Route path="/" element={<InicioPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/nosotros" element={<NosotrosPages />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/categoria/:categoriaId" element={<ProductoporCatalogo />} />
        <Route path="/producto/:id" element={<DetalleProductoPage />} />
        {/* Aquí añadiremos más rutas pronto, por ejemplo:
          <Route path="/login" element={<LoginPage />} />
          <Route path="/productos" element={<ProductosPage />} />
        */}
      </Routes>
    </Router>
  );
};

export default App;