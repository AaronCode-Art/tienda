import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import CartOrderPreview from '../../components/procesopago/CartOrderPreview';
import CheckoutForm from '../../components/procesopago/CheckoutForm';
import RecommendationsSection from '../../components/procesopago/RecommendationsSection';
import { useAuth } from '../../hooks/useAuth';
import useCheckout from '../../hooks/useCheckout';
import PaymentGateway from '../../components/procesopago/PaymentGateway';
import './carritoPage.css';

const CarritoPage: React.FC = () => {
  const { usuario, authReady } = useAuth();
  const navigate = useNavigate();
  const {
    pendingOrders,
    stage,
    loading,
    saving,
    error,
    successMessage,
    continueToForm,
    completeCheckout,
    resetStage,
  } = useCheckout(usuario?.id ?? null, authReady);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!usuario) {
      navigate('/login', { replace: true, state: { from: '/carrito' } });
    }
  }, [authReady, usuario, navigate]);

  const totalAmount = pendingOrders.reduce((sum, pedido) => sum + pedido.total, 0);

  // Mapeo de etapas para el indicador visual
  const steps = [
    { id: 'list', label: 'Resumen' },
    { id: 'form', label: 'Pago y Envío' },
    { id: 'success', label: '¡Listo!' }
  ];

  return (
    <div className="carrito-page">
      <Encabezado showBanner={false} />

      <main className="carrito-content">
        <nav className="checkout-stepper">
          {steps.map((s, idx) => (
            <div key={s.id} className={`step ${stage === s.id ? 'active' : ''} ${steps.findIndex(x => x.id === stage) > idx ? 'completed' : ''}`}>
              <span className="step-number">{idx + 1}</span>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </nav>

        <section className="carrito-hero">
          <h1>{stage === 'list' ? 'Tu Carrito' : stage === 'form' ? 'Finalizar Compra' : '¡Compra Exitosa!'}</h1>
          {stage !== 'success' && (
            <p>Revisa todos los pedidos pendientes y finaliza el pago de una sola vez.</p>
          )}
        </section>

        {stage === 'list' && (
          <>
            {pendingOrders.length > 0 && (
              <>
                <CartOrderPreview pedidos={pendingOrders} onContinue={continueToForm} />
                <RecommendationsSection />
              </>
            )}

            {pendingOrders.length === 0 && !loading && (
              <div className="carrito-empty">
                <p>No tienes pedidos pendientes. Compra productos para ver tu carrito aquí.</p>
                <button type="button" className="btn-primary" onClick={() => navigate('/productos')}>
                  Seguir comprando
                </button>
              </div>
            )}
          </>
        )}

        {stage === 'form' && usuario && (
          <CheckoutForm
            pedidosCount={pendingOrders.length}
            totalAmount={totalAmount}
            usuario={usuario}
            onSubmit={completeCheckout}
            saving={saving}
            error={error}
          />
        )}

        {stage === 'success' && (
  <div className="success-container">
    <section className="checkout-success">
      <div className="success-icon">✓</div>
      <h2>¡Gracias por tu compra, {usuario?.nombre}!</h2>
      <p>{successMessage ?? 'Tu pedido ha sido procesado correctamente.'}</p>

      {/* === BOLETA / FACTURA PREVIEW === */}
      <div className="boleta-card">
        <div className="boleta-header">
          <h3>Comprobante Electrónico</h3>
          <span className="boleta-tipo">
            {pendingOrders[0]?.tipo_comprobante === 'factura' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA'}
          </span>
        </div>

        <div className="boleta-content">
          <div className="boleta-info">
            <p><strong>N° de Pedido:</strong> #{pendingOrders[0]?.id || 'N/A'}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-PE', { 
                day: '2-digit', month: 'long', year: 'numeric' 
              })}</p>
            <p><strong>Cliente:</strong> {usuario?.nombre} {usuario?.apellido}</p>
            
            {pendingOrders[0]?.tipo_comprobante === 'factura' ? (
              <>
                <p><strong>RUC:</strong> {pendingOrders[0]?.ruc || '—'}</p>
                <p><strong>Razón Social:</strong> {pendingOrders[0]?.razon_social || '—'}</p>
              </>
            ) : (
              <p><strong>DNI:</strong> {usuario?.dni || '—'}</p>
            )}
          </div>

          <div className="boleta-total">
            <span>Total pagado</span>
            <strong>S/ {(totalAmount + (pendingOrders[0]?.tipo_entrega === 'delivery' ? 15 : 0)).toFixed(2)}</strong>
          </div>

          <div className="boleta-items">
            <h4>Productos:</h4>
            <ul>
              {pendingOrders.flatMap(p => p.detalles || []).map((item, idx) => (
                <li key={idx}>
                  {item.cantidad} × {item.producto?.nombre} — S/ {(item.precio_unitario * item.cantidad).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="boleta-actions">
          <button 
            type="button" 
            className="btn-print"
            onClick={() => window.print()}
          >
            🖨️ Imprimir Boleta
          </button>
          <button 
            type="button" 
            className="btn-download"
            onClick={() => alert('En un sistema real aquí se descargaría el PDF de la boleta')}
          >
            📄 Descargar PDF
          </button>
        </div>
      </div>

      <div className="success-actions">
        <button 
          type="button" 
          className="btn-primary" 
          onClick={() => navigate('/pedidos')}
        >
          Ver mis pedidos
        </button>
        <button 
          type="button" 
          className="btn-secondary" 
          onClick={resetStage}
        >
          Volver al inicio
        </button>
      </div>

      <p className="success-note">
        El comprobante electrónico también ha sido enviado a tu correo registrado.
      </p>
    </section>
  </div>
)}
      </main>

      <Footer />
    </div>
  );
};

export default CarritoPage;
