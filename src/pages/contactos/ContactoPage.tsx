import React from 'react';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import './ContactoPage.css';

const ContactoPage: React.FC = () => {
  return (
    <div className="contacto-page">
      <Encabezado showBanner={false} />

      <main className="contacto-contenido">
        <header className="contacto-header">
          <h1 className="contacto-titulo">Contáctanos</h1>
          <p className="contacto-subtitulo">Estamos aquí para ayudarte con tus repuestos</p>
        </header>

        <section className="contacto-info">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📞</div>
              <h3>Teléfono</h3>
              <p>+51 999 999 999</p>
              <a href="tel:+51999999999" className="info-link">Llamar ahora</a>
            </div>
            <div className="info-item">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>contacto@so-repuestos.com</p>
              <a href="mailto:contacto@so-repuestos.com" className="info-link">Enviar email</a>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <h3>Dirección</h3>
              <p>Av. Principal 123, Lima, Perú</p>
              <a href="#" className="info-link">Ver mapa</a>
            </div>
            <div className="info-item">
              <div className="info-icon">🕒</div>
              <h3>Horarios</h3>
              <p>Lun - Vie: 9:00 - 18:00<br />Sáb: 9:00 - 14:00</p>
            </div>
          </div>
        </section>

        <section className="contacto-redes">
          <h2>Síguenos en Redes Sociales</h2>
          <div className="redes-grid">
            <a href="https://wa.me/51999999999" className="red-item" target="_blank" rel="noopener noreferrer">
              <div className="red-icon">💬</div>
              <h3>WhatsApp</h3>
              <p>Chatea con nosotros</p>
            </a>
            <a href="https://facebook.com/sorepuestos" className="red-item" target="_blank" rel="noopener noreferrer">
              <div className="red-icon">📘</div>
              <h3>Facebook</h3>
              <p>Síguenos en Facebook</p>
            </a>
            <a href="https://instagram.com/sorepuestos" className="red-item" target="_blank" rel="noopener noreferrer">
              <div className="red-icon">📷</div>
              <h3>Instagram</h3>
              <p>Descubre nuestros productos</p>
            </a>
            <a href="https://twitter.com/sorepuestos" className="red-item" target="_blank" rel="noopener noreferrer">
              <div className="red-icon">🐦</div>
              <h3>Twitter</h3>
              <p>Últimas novedades</p>
            </a>
          </div>
        </section>

        <section className="contacto-formulario">
          <h2>Envíanos un Mensaje</h2>
          <form className="form-contacto">
            <div className="form-group">
              <input type="text" placeholder="Tu nombre" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Tu email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Tu mensaje" rows={5} required></textarea>
            </div>
            <button type="submit" className="form-boton">Enviar Mensaje</button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactoPage;
