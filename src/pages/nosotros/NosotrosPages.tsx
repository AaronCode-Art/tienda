import React from 'react';
import { Link } from 'react-router-dom';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import './NosotrosPages.css';

const NosotrosPages: React.FC = () => {
  return (
    <div className="nosotros-page">
      <Encabezado showBanner={false} />

      <main className="nosotros-contenido">
        <header className="nosotros-header">
          <h1 className="nosotros-titulo">Sobre Nosotros</h1>
          <p className="nosotros-subtitulo">Conoce la empresa detrás de tus repuestos favoritos</p>
        </header>

        <section className="nosotros-seccion">
          <div className="nosotros-texto">
            <h2>Nuestra Historia</h2>
            <p>
              En S&O, nos apasiona proporcionar repuestos de la más alta calidad para que tus dispositivos electrónicos funcionen como nuevos.
              Fundada con la visión de ofrecer soluciones confiables y accesibles, hemos crecido para convertirnos en un referente en el mercado de repuestos.
            </p>
            <p>
              Nuestro compromiso va más allá de la venta: nos aseguramos de que cada producto cumpla con estándares estrictos de calidad,
              garantizando durabilidad y rendimiento excepcional.
            </p>
          </div>
          <div className="nosotros-imagen">
            <img src="/src/assets/nosotros-hero.png" alt="Equipo S&O" />
          </div>
        </section>

        <section className="nosotros-valores">
          <h2>¿Por qué elegirnos?</h2>
          <div className="valores-grid">
            <div className="valor-item">
              <div className="valor-icon">🛡️</div>
              <h3>Calidad Garantizada</h3>
              <p>Cada repuesto pasa por rigurosos controles de calidad para asegurar su fiabilidad y durabilidad.</p>
            </div>
            <div className="valor-item">
              <div className="valor-icon">🚚</div>
              <h3>Envío Gratis</h3>
              <p>Disfruta de envío gratuito en todos tus pedidos. Tu satisfacción es nuestra prioridad.</p>
            </div>
            <div className="valor-item">
              <div className="valor-icon">⚡</div>
              <h3>Servicio Confiable</h3>
              <p>Atención al cliente excepcional y soporte técnico para resolver cualquier duda o problema.</p>
            </div>
            <div className="valor-item">
              <div className="valor-icon">💡</div>
              <h3>Innovación Continua</h3>
              <p>Mantenemos nuestro catálogo actualizado con las últimas tendencias y tecnologías en repuestos.</p>
            </div>
          </div>
        </section>

        <section className="nosotros-cta">
          <h2>¿Listo para encontrar tus repuestos?</h2>
          <p>Explora nuestro catálogo completo y descubre productos que se adaptan a tus necesidades.</p>
          <Link to="/productos" className="nosotros-boton">Ver Productos</Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NosotrosPages;
