import React from 'react';
import { Link } from 'react-router-dom';
import { useProductos } from '../../hooks/useProductos';
import './RecommendationsSection.css';

const RecommendationsSection: React.FC = () => {
  const { obtenerAleatorios } = useProductos();
  const productos = obtenerAleatorios().slice(0, 3);

  return (
    <section className="recommendations-section">
      <h2>También te puede interesar</h2>
      <div className="recommendations-grid">
        {productos.map((producto) => (
          <article key={producto.id} className="recommendation-card">
            <img src={producto.imagenUrl} alt={producto.nombre} />
            <div className="recommendation-info">
              <span>{producto.nombre}</span>
              <strong>S/. {producto.precio.toFixed(2)}</strong>
            </div>
            <Link to={`/producto/${producto.id}`} className="btn-secondary">
              Comprar
            </Link>
          </article>
        ))}
      </div>
      <div className="continue-shopping">
        <Link to="/productos" className="btn-primary">
          Seguir comprando
        </Link>
      </div>
    </section>
  );
};

export default RecommendationsSection;
