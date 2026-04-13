import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './encabezado.css';

interface BannerProps {
  showBanner?: boolean;
}

const Encabezado: React.FC<BannerProps> = ({ showBanner = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`hero-master-container ${!showBanner ? 'no-banner' : ''} ${isMenuOpen ? 'nav-is-open' : ''}`}>
      
      {/* Fondo oscuro al abrir menú */}
      <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>

      <header className="hero-header">
        {/* IZQUIERDA: Logo */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-brand">S&O</span>
          </Link>
          <span className="header-slogan">Repuestos al mejor precio</span>
        </div>

        {/* CENTRO: Buscador (Se oculta en móvil para ir dentro del menú) */}
        <div className="header-center">
          <div className="search-wrapper">
            <input type="text" placeholder="Buscar producto..." />
            <Search className="search-icon" size={20} />
          </div>
        </div>

        {/* DERECHA: Nav + Acciones */}
        <div className="header-right">
          <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav-header">
              <span className="logo-brand">S&O</span>
              <button className="close-menu" onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
            </div>
            
            {/* Buscador dentro del menú móvil */}
            <div className="mobile-search">
                <div className="search-wrapper">
                    <input type="text" placeholder="¿Qué buscas?" />
                    <Search className="search-icon" size={20} />
                </div>
            </div>

            <ul>
              <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
              <li><Link to="/productos" onClick={() => setIsMenuOpen(false)}>Productos</Link></li>
              <li><Link to="/nosotros" onClick={() => setIsMenuOpen(false)}>Nosotros</Link></li>
              <li><Link to="/contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <button className="icon-btn cart-btn">
              <ShoppingBag size={26} />
              <span className="cart-count">0</span>
            </button>
            <button className="icon-btn profile-btn">
              <User size={26} />
            </button>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
              <Menu size={30} />
            </button>
          </div>
        </div>
      </header>

      {showBanner && (
        <main className="hero-banner-content">
          <div className="banner-text-side">
            <h1>los mejores<br /><span>precios</span></h1>
            <p className="banner-subtext">Calidad garantizada en componentes de alto rendimiento.</p>
            <Link to="/productos" className="btn-banner-action">ver catálogo</Link>
          </div>
          <div className="banner-image-side">
            <img src="../src/assets/hero-hardware.png" alt="Hardware" className="hardware-render" />
          </div>
        </main>
      )}
    </div>
  );
};

export default Encabezado;
