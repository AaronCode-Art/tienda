import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import CartOrderPreview from '../../components/procesopago/CartOrderPreview';
import CheckoutForm from '../../components/procesopago/CheckoutForm';
import RecommendationsSection from '../../components/procesopago/RecommendationsSection';
import { useAuth } from '../../hooks/useAuth';
import useCheckout from '../../hooks/useCheckout';
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

  return (
    <div className="carrito-page">
      <Encabezado showBanner={false} />

      <main className="carrito-content">
        <section className="carrito-hero">
          <p>Revisa todos los pedidos pendientes y finaliza el pago de una sola vez.</p>
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
          <section className="checkout-success">
            <h2>¡Listo!</h2>
            <p>{successMessage ?? 'Todos tus pedidos pendientes se confirmaron correctamente.'}</p>
            <button type="button" className="btn-primary" onClick={resetStage}>
              Volver a pedidos pendientes
            </button>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CarritoPage;
