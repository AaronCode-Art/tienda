import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './footer.css'; // Importamos el nuevo archivo

const Footer: React.FC = () => {
  return (
    <footer className="footer-principal">
      <div className="footer-contenedor">
        
        <div className="footer-columna marca">
          <h3 className="footer-logo">Tienda <span>S&O</span></h3>
          <p className="footer-descripcion">donde las compras son al mejor precio</p>
        </div>

        <div className="footer-columna">
          <h4 className="footer-titulo">Enlaces</h4>
          <ul className="footer-lista">
            <li><a href="/">Inicio</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
          </ul>
        </div>

        <div className="footer-columna">
          <h4 className="footer-titulo">Soporte</h4>
          <ul className="footer-lista">
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/legal">Legal</a></li>
          </ul>
        </div>

        <div className="footer-columna">
          <h4 className="footer-titulo">Síguenos</h4>
          <div className="footer-redes">
            <FaFacebook size={20} />
            <FaInstagram size={20} />
            <FaTwitter size={20} />
          </div>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} Tienda S&O. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
