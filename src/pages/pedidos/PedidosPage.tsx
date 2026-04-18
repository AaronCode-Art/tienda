import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Store, Clock } from 'lucide-react';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import { useAuth } from '../../hooks/useAuth';
import { usePedidos } from '../../hooks/usePedidos';
import './pedidosPage.css';

const PedidosPage: React.FC = () => {
  const { usuario, authReady } = useAuth();
  const { pedidos, loading, error } = usePedidos(usuario?.id ?? null, authReady);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!usuario) {
      navigate('/login', { replace: true, state: { from: '/pedidos' } });
    }
  }, [authReady, usuario, navigate]);

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'confirmado':
        return <Package size={20} />;
      case 'en_preparacion':
      case 'en_proceso':
        return <Clock size={20} />;
      case 'en_transito':
      case 'llegando':
        return <Truck size={20} />;
      case 'listo_para_recoger':
        return <Store size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmado':
        return 'estado-confirmado';
      case 'en_preparacion':
      case 'en_proceso':
        return 'estado-proceso';
      case 'en_transito':
      case 'llegando':
        return 'estado-transito';
      case 'listo_para_recoger':
        return 'estado-listo';
      default:
        return 'estado-default';
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="pedidos-page">
      <Encabezado showBanner={false} />

      <main className="pedidos-content">
        <section className="pedidos-header">
          <h1>Mis Pedidos</h1>
          <p>Consulta el estado de tus órdenes y detalles de envío</p>
        </section>

        {loading && (
          <div className="pedidos-loading">
            <p>Cargando pedidos...</p>
          </div>
        )}

        {error && (
          <div className="pedidos-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && pedidos.length === 0 && (
          <div className="pedidos-empty">
            <Package size={48} />
            <h2>No tienes pedidos</h2>
            <p>Aún no has realizado ningún pedido. ¡Explora nuestros productos!</p>
          </div>
        )}

        {!loading && pedidos.length > 0 && (
          <div className="pedidos-list">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                <div className="pedido-header">
                  <div className="pedido-info-general">
                    <h3>Pedido #{pedido.id}</h3>
                    <p className="pedido-fecha">{formatFecha(pedido.fecha)}</p>
                  </div>
                  <div className="pedido-estado">
                    <span className={`estado-badge ${getEstadoColor(pedido.estado_actual)}`}>
                      {getEstadoIcon(pedido.estado_actual)}
                      <span>{pedido.estado_actual}</span>
                    </span>
                  </div>
                </div>

                <div className="pedido-detalles">
                  {pedido.detalles && pedido.detalles.length > 0 ? (
                    <div className="detalles-productos">
                      {pedido.detalles.map((detalle) => (
                        <div key={detalle.id} className="detalle-item">
                          {detalle.producto?.imagenUrl && (
                            <img
                              src={detalle.producto.imagenUrl}
                              alt={detalle.producto?.nombre}
                              className="producto-imagen"
                            />
                          )}
                          <div className="detalle-info">
                            <h4>{detalle.producto?.nombre || 'Producto'}</h4>
                            <p className="detalle-marca">
                              {detalle.producto?.marca} {detalle.producto?.modelo}
                            </p>
                            <div className="detalle-precio">
                              <span className="cantidad">Cantidad: {detalle.cantidad}</span>
                              <span className="precio">S/. {detalle.precio_unitario.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Sin detalles disponibles</p>
                  )}
                </div>

                <div className="pedido-info">
                  <div className="info-item">
                    <span className="label">Tipo de entrega:</span>
                    <span className="value">
                      {pedido.tipo_entrega === 'delivery' ? 'Delivery' : 'Recojo en tienda'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Método de pago:</span>
                    <span className="value">{pedido.metodo_pago}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total:</span>
                    <span className="value precio-total">S/. {pedido.total.toFixed(2)}</span>
                  </div>
                </div>

                {pedido.direccion_envio && (
                  <div className="pedido-direccion">
                    <h4>Dirección de envío</h4>
                    <p>{pedido.direccion_envio.calle}</p>
                    <p className="distrito">{pedido.direccion_envio.distrito}</p>
                    <p className="referencia">{pedido.direccion_envio.referencia}</p>
                  </div>
                )}

                <div className="pedido-seguimiento">
                  <h4>Seguimiento</h4>
                  <div className="timeline">
                    {pedido.seguimiento.map((evento, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <p className="estado-texto">{evento.estado}</p>
                          <p className="fecha-texto">{formatFecha(evento.fecha)}</p>
                          <p className="mensaje-texto">{evento.mensaje}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PedidosPage;
