import React from 'react';
import type { Pedido } from '../../types/pedido';
import './PendingOrdersList.css';

interface PendingOrdersListProps {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  onContinue: () => void;
}

const PendingOrdersList: React.FC<PendingOrdersListProps> = ({ pedidos, loading, error, onContinue }) => {
  return (
    <section className="pending-orders-list">
      <h2>Pedidos pendientes por pagar</h2>

      {loading && <p className="status-message">Cargando pedidos pendientes...</p>}
      {error && <p className="status-error">{error}</p>}

      {!loading && pedidos.length === 0 && (
        <p className="status-message">No tienes pedidos pendientes. Puedes comprar productos para generar uno.</p>
      )}

      {!loading && pedidos.length > 0 && (
        <>
          <div className="pending-orders-cards">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="pending-order-card">
                <div className="pending-order-header">
                  <span>Pedido #{pedido.id}</span>
                  <span>{new Date(pedido.fecha).toLocaleDateString('es-PE')}</span>
                </div>
                <div className="pending-order-body">
                  <p>Total pendiente: S/. {pedido.total.toFixed(2)}</p>
                  <p>Productos: {pedido.detalles?.length ?? 0}</p>
                  <p>Estado: {pedido.estado_actual}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pending-orders-actions">
            <button type="button" className="btn-primary" onClick={onContinue}>
              Continuar con todos los pedidos
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default PendingOrdersList;
