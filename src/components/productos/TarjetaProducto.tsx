import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import pedidosService from '../../services/PedidosService';
import type { Producto } from '../../types/producto';
import './TarjetaProducto.css';

interface TarjetaProps {
  producto: Producto;
}

const TarjetaProducto: React.FC<TarjetaProps> = ({ producto }) => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleComprar = async () => {
    if (!usuario) {
      alert('Inicie sesión para completar la compra.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      await pedidosService.createPedidoConDetalle(usuario.id, producto);
      window.dispatchEvent(new Event('pendingOrdersUpdated'));
      alert('Compra registrada como pendiente. Si ya tenías un pedido pendiente, se actualizó la cantidad del mismo producto.');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('No se pudo registrar el pedido. Intenta más tarde.');
    }
  };

  return (
    <div className="tarjeta-producto-premium">
      {/* BADGE DE STOCK */}
      {producto.stock <= 5 && producto.stock > 0 && (
        <span className="badge-alerta">¡últimas unidades!</span>
      )}
      
      <Link to={`/producto/${producto.id}`} className="tarjeta-link-wrapper">
        <div className="tarjeta-imagen-cont">
          <img src={producto.imagenUrl} alt={producto.nombre} loading="lazy" />
        </div>

        <div className="tarjeta-info">
          <div className="meta-info">
            <span className="tarjeta-marca">{producto.marca}</span>
            <span className={`stock-status ${producto.stock > 0 ? 'instock' : 'outstock'}`}>
              {producto.stock > 0 ? 'disponible' : 'agotado'}
            </span>
          </div>
          
          <h3 className="tarjeta-nombre">{producto.nombre}</h3>
        </div>
      </Link>

      <div className="tarjeta-footer">
        <p className="tarjeta-precio">S/ {producto.precio.toFixed(2)}</p>
        <br/>
        <button className="btn-comprar" onClick={handleComprar}>
          Comprar
        </button>
      </div>
    </div>
  );
};

export default TarjetaProducto;