import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import { useAuth } from '../../hooks/useAuth';
import './perfilPage.css';

const PerfilPage: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  if (!usuario) {
    return (
      <div className="perfil-page">
        <Encabezado showBanner={false} />
        <main className="perfil-content">
          <section className="perfil-card">
            <h1>No has iniciado sesión</h1>
            <p>Necesitas iniciar sesión para ver tu perfil.</p>
            <Link to="/login" className="perfil-button">Ir a iniciar sesión</Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="perfil-page">
      <Encabezado showBanner={false} />
      <main className="perfil-content">
        <section className="perfil-card">
          <div className="perfil-header">
            <span className="perfil-initial">{usuario.nombre.charAt(0).toUpperCase()}</span>
            <div>
              <h1>{usuario.nombre} {usuario.apellido}</h1>
              <p>{usuario.correo}</p>
            </div>
          </div>

          <div className="perfil-info-grid">
            <div>
              <h2>DNI</h2>
              <p>{usuario.dni}</p>
            </div>
            <div>
              <h2>Distrito</h2>
              <p>{usuario.distrito}</p>
            </div>
            <div>
              <h2>Dirección</h2>
              <p>{usuario.direccion}</p>
            </div>
            <div>
              <h2>Código postal</h2>
              <p>{usuario.codigo_postal}</p>
            </div>
          </div>

          <button type="button" className="perfil-button perfil-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PerfilPage;
