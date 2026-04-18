import React from 'react';
import type { Pedido } from '../../types/pedido';
import './CartOrderPreview.css';

interface CartOrderPreviewProps {
  pedidos: Pedido[];
  onContinue: () => void;
}

const CartOrderPreview: React.FC<CartOrderPreviewProps> = ({ pedidos, onContinue }) => {
  const items = pedidos.flatMap((pedido) => pedido.detalles ?? []);
  const subtotal = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
  const savings = 0;
  const total = subtotal;
  const ordersCount = pedidos.length;

  const formatMoneda = (value: number) => `S/. ${value.toFixed(2)}`;

  return (
    <section className="cart-preview">
      <div className="cart-preview-left">
        <div className="cart-preview-header">
          <h2>Productos en tu carrito</h2>
          <span>{ordersCount} pedidos pendientes</span>
        </div>

        <div className="cart-items-list">
          {items.map((detalle) => (
            <article key={detalle.id} className="cart-item-card">
              <div className="cart-item-image">
                {detalle.producto?.imagenUrl ? (
                  <img src={detalle.producto.imagenUrl} alt={detalle.producto.nombre} />
                ) : (
                  <div className="cart-item-placeholder">Imagen</div>
                )}
              </div>
              <div className="cart-item-info">
                <h3>{detalle.producto?.nombre ?? 'Producto'}</h3>
                <p className="cart-item-meta">
                  {detalle.producto?.marca ?? 'Marca'} {detalle.producto?.modelo ?? ''}
                </p>
                <p className="cart-item-stock">Stock disponible</p>
                <div className="cart-item-qty">
                  <span>Cantidad: {detalle.cantidad}</span>
                </div>
              </div>
              <div className="cart-item-price">
                <p>{formatMoneda(detalle.precio_unitario)}</p>
                <p className="cart-item-subtotal">Subtotal: {formatMoneda(detalle.precio_unitario * detalle.cantidad)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="cart-preview-right">
        <div className="cart-summary-card">
          <h2>Resumen de la orden</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatMoneda(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Ahorrado</span>
            <strong>{formatMoneda(savings)}</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>{formatMoneda(total)}</strong>
          </div>
          <button type="button" className="btn-primary" onClick={onContinue}>
            Continuar con todos los pedidos
          </button>
          <p className="summary-note">
            Al realizar tu pedido aceptas los términos y condiciones y que nosotros usemos datos personales de acuerdo con nuestra política de privacidad.
          </p>
          <div className="summary-benefits">
            <div className="benefit-item">
              <strong>Envío gratis</strong>
              <span>Envío gratis en productos seleccionados.</span>
            </div>
            <div className="benefit-item">
              <strong>Garantía SyO</strong>
              <span>Este producto tiene garantía SyO.</span>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default CartOrderPreview;
