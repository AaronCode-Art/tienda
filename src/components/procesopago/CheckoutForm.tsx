import React, { useState } from 'react';
import type { Usuario } from '../../types/usuario';
import './CheckoutForm.css';

interface CheckoutFormProps {
  pedidosCount: number;
  totalAmount: number;
  usuario: Usuario;
  onSubmit: (data: {
    correo: string;
    tipo_entrega: 'delivery' | 'recojo_tienda';
    distrito: string;
    direccion: string;
    referencia: string;
  }) => Promise<void>;
  saving: boolean;
  error: string | null;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ pedidosCount, totalAmount, usuario, onSubmit, saving, error }) => {
  const [correo, setCorreo] = useState(usuario.correo);
  const [tipoEntrega, setTipoEntrega] = useState<'delivery' | 'recojo_tienda'>('delivery');
  const [distrito, setDistrito] = useState(usuario.distrito ?? '');
  const [direccion, setDireccion] = useState(usuario.direccion ?? '');
  const [referencia, setReferencia] = useState(usuario.referencia ?? '');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ correo, tipo_entrega: tipoEntrega, distrito, direccion, referencia });
  };

  return (
    <section className="checkout-form-section">
      <h2>Finalizar pago de pedidos pendientes</h2>
      <p>Estás pagando {pedidosCount} pedidos por un total de S/. {totalAmount.toFixed(2)}.</p>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-row form-radio-group">
          <p>Método de entrega</p>
          <label>
            <input
              type="radio"
              name="tipoEntrega"
              value="delivery"
              checked={tipoEntrega === 'delivery'}
              onChange={() => setTipoEntrega('delivery')}
            />
            Delivery
          </label>
          <label>
            <input
              type="radio"
              name="tipoEntrega"
              value="recojo_tienda"
              checked={tipoEntrega === 'recojo_tienda'}
              onChange={() => setTipoEntrega('recojo_tienda')}
            />
            Recojo en tienda
          </label>
        </div>

        {tipoEntrega === 'delivery' && (
          <>
            <div className="form-row">
              <label htmlFor="distrito">Distrito</label>
              <input
                id="distrito"
                type="text"
                value={distrito}
                onChange={(e) => setDistrito(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="referencia">Referencia</label>
              <input
                id="referencia"
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {tipoEntrega === 'recojo_tienda' && (
          <p className="pickup-note">El recojo en tienda estará listo en la sucursal una vez confirmado el pedido.</p>
        )}

        {error && <p className="status-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Procesando...' : 'Finalizar compra'}
        </button>
      </form>
    </section>
  );
};

export default CheckoutForm;
