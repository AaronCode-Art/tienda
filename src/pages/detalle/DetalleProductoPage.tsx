import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductos } from '../../hooks/useProductos';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import TarjetaProducto from '../../components/productos/TarjetaProducto';
import './DetalleProducto.css';

const DetalleProductoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { productos } = useProductos();
  const [cantidad, setCantidad] = useState(1);

  // 1. Buscar el producto actual en el JSON
  const producto = useMemo(() => 
    productos.find(p => p.id === id), 
  [id, productos]);

  // 2. Lógica para productos relacionados (misma categoría)
  const relacionados = useMemo(() => {
    if (!producto) return [];
    return productos
      .filter(p => p.categoria === producto.categoria && p.id !== id)
      .slice(0, 4);
  }, [producto, productos, id]);

  if (!producto) return <div className="error-container">Producto no encontrado</div>;

  return (
    <div className="detalle-page-gama-alta">
      {/* Encabezado limpio sin banner masivo */}
      <Encabezado showBanner={false} />

      <main className="detalle-layout-premium">
        
        {/* COLUMNA IZQUIERDA: GALERÍA DE IMAGEN */}
        <section className="galeria-producto-premium">
          <div className="contenedor-imagen-principal">
            <img src={producto.imagenUrl} alt={producto.nombre} className="imagen-hero" />
          </div>
          {/* Aquí podrías añadir miniaturas si tu JSON tuviera array de imágenes */}
        </section>

        {/* COLUMNA DERECHA: INFORMACIÓN Y COMPRA */}
        <section className="info-compra-premium">
          <div className="cabecera-producto">
            <span className="categoria-badge">{producto.categoria}</span>
            <h1 className="titulo-producto-huge">{producto.nombre}</h1>
            <p className="subtitulo-sku">Marca: {producto.marca} | Modelo: {producto.modelo}</p>
          </div>

          <div className="bloque-precio-premium">
            <span className="precio-final">S/ {producto.precio.toFixed(2)}</span>
            <div className={`status-stock ${producto.stock > 0 ? 'en-stock' : 'sin-stock'}`}>
              {producto.stock > 0 ? `✓ En Stock (${producto.stock} uds)` : '✕ Agotado'}
            </div>
          </div>

          {/* DESCRIPCIÓN CORTA / RESUMEN DE LA BD */}
          <div className="resumen-descripcion">
            <h3>Descripción rápida</h3>
            <p>{producto.descripcion}</p> 
          </div>

          <div className="acciones-compra-premium">
            <div className="control-cantidad">
              <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>-</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))}>+</button>
            </div>
            <button className="btn-add-cart-premium">añadir al carrito</button>
          </div>
          
          <div className="info-adicional-premium">
            <p>🛡️ Garantía oficial de la marca.</p>
            <p>🚚 Envío express disponible.</p>
          </div>
        </section>

        {/* SECCIÓN INFERIOR: ESPECIFICACIONES TÉCNICAS */}
        <section className="detalles-tecnicos-premium">
          <h2 className="titulo-detalles">especificaciones completas</h2>
          <div className="grid-especificaciones">
            <div className="item-espec"><span>Marca</span><span>{producto.marca}</span></div>
            <div className="item-espec"><span>Modelo</span><span>{producto.modelo}</span></div>
            <div className="item-espec"><span>Categoría</span><span>{producto.categoria}</span></div>
            <div className="item-espec"><span>Tipo</span><span>Repuesto Original</span></div>
          </div>
        </section>

        {/* SECCIÓN FINAL: PRODUCTOS RECOMENDADOS */}
        <section className="seccion-recomendados-premium">
          <h2 className="titulo-recomendados">te puede interesar</h2>
          <div className="grid-recomendados-premium">
            {relacionados.map(prod => (
              <TarjetaProducto key={prod.id} producto={prod} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DetalleProductoPage;