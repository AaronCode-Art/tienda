import React from 'react';
import { Link } from 'react-router-dom';
import './TarjetaProducto.css';

interface TarjetaProps {
  producto: any;
}

const TarjetaProducto: React.FC<TarjetaProps> = ({ producto }) => {
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
        <button 
          className="btn-comprar" 
          onClick={() => alert('Función de compra próximamente')}
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default TarjetaProducto;