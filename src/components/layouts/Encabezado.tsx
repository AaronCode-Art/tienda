import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePendingOrdersCount } from '../../hooks/usePendingOrdersCount';
import './encabezado.css';

interface BannerProps {
  showBanner?: boolean;
}

const Encabezado: React.FC<BannerProps> = ({ showBanner = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const { usuario, authReady, logout } = useAuth();
  const navigate = useNavigate();
  const { count: pendingCount } = usePendingOrdersCount(usuario?.id ?? null, authReady);

  const fromState = { state: { from: location.pathname } };
  const initial = usuario?.nombre?.charAt(0).toUpperCase() ?? '';

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 10000); // 10 segundos
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`hero-master-container ${!showBanner ? 'no-banner' : ''} ${isMenuOpen ? 'nav-is-open' : ''}`}>
      <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>

      <header className="hero-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-brand">S&O</span>
          </Link>
          <span className="header-slogan">Repuestos al mejor precio</span>
        </div>

        <div className="header-center">
          <div className="search-wrapper">
            <input type="text" placeholder="Buscar producto..." />
            <Search className="search-icon" size={20} />
          </div>
        </div>

        <div className="header-right">
          <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav-header">
              <span className="logo-brand">S&O</span>
              <button className="close-menu" onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
            </div>

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
              <li><Link to="/pedidos" onClick={() => setIsMenuOpen(false)}>Ver estado del pedido</Link></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="icon-btn cart-btn" type="button" onClick={() => navigate('/carrito')}>
              <ShoppingBag size={26} />
              <span className="cart-count">{pendingCount}</span>
            </button>

            {usuario ? (
              <div
                className="profile-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/perfil" className="profile-initial">
                  {initial || <User size={20} />}
                </Link>
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <Link to="/perfil">Mi perfil</Link>
                    <button type="button" onClick={logout}>Cerrar sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" state={fromState.state} className="icon-btn profile-btn">
                <User size={26} />
              </Link>
            )}

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
            <img src="../src/imagenes/banner/bn.png" alt="Hardware" className="hardware-render" />
          </div>
        </main>
      )}
    </div>
  );
};

export default Encabezado;
