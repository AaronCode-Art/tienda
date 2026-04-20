import React, { useState } from 'react';
import PaymentGateway from './PaymentGateway';
import type { Usuario } from '../../types/usuario';
import './CheckoutForm.css';

interface CheckoutFormProps {
  pedidosCount: number;
  totalAmount: number;
  usuario: Usuario;
  onSubmit: (data: any) => void;
  saving: boolean;
  error: string | null;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  pedidosCount,
  totalAmount,
  usuario,
  onSubmit,
  saving,
  error
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'pagoefectivo'>('tarjeta');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'recojo_tienda'>('delivery');
  
  // Nueva lógica para comprobante
  const [comprobanteTipo, setComprobanteTipo] = useState<'boleta' | 'factura'>('boleta');
  const [ruc, setRuc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [direccionFiscal, setDireccionFiscal] = useState(usuario.direccion || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      metodo_pago: paymentMethod,
      tipo_entrega: deliveryType,
      direccion_envio: deliveryType === 'delivery' ? {
        calle: usuario.direccion,
        distrito: usuario.distrito,
        referencia: usuario.referencia
      } : null,
      // Datos del comprobante
      tipo_comprobante: comprobanteTipo,
      dni: usuario.dni || null,
      ruc: comprobanteTipo === 'factura' ? ruc : null,
      razon_social: comprobanteTipo === 'factura' ? razonSocial : null,
      direccion_fiscal: comprobanteTipo === 'factura' ? direccionFiscal : null,
    });
  };

  return (
    <form className="checkout-form-container" onSubmit={handleSubmit}>
      <div className="checkout-grid">
        
        {/* Sección izquierda */}
        <div className="checkout-section main-info">
          <h2>Información de envío y pago</h2>

          <div className="user-info-preview">
            <p><strong>Destinatario:</strong> {usuario.nombre} {usuario.apellido}</p>
            <p><strong>Dirección:</strong> {usuario.direccion}, {usuario.distrito}</p>
          </div>

          <div className="delivery-options">
            <label className="radio-label">
              <input 
                type="radio" 
                checked={deliveryType === 'delivery'} 
                onChange={() => setDeliveryType('delivery')} 
              />
              Envío a domicilio (S/ 15.00)
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                checked={deliveryType === 'recojo_tienda'} 
                onChange={() => setDeliveryType('recojo_tienda')} 
              />
              Recojo en tienda (Gratis)
            </label>
          </div>

          {/* === NUEVA SECCIÓN: TIPO DE COMPROBANTE === */}
          <div className="comprobante-section">
            <h3>Tipo de comprobante</h3>
            <div className="comprobante-options">
              <label className="radio-label">
                <input 
                  type="radio" 
                  checked={comprobanteTipo === 'boleta'} 
                  onChange={() => setComprobanteTipo('boleta')} 
                />
                Boleta electrónica (DNI)
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  checked={comprobanteTipo === 'factura'} 
                  onChange={() => setComprobanteTipo('factura')} 
                />
                Factura electrónica (RUC)
              </label>
            </div>

            {comprobanteTipo === 'factura' && (
              <div className="factura-fields">
                <div className="form-row">
                  <label>RUC</label>
                  <input 
                    type="text" 
                    placeholder="Ingrese su RUC (11 dígitos)" 
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    maxLength={11}
                    required 
                  />
                </div>
                <div className="form-row">
                  <label>Razón Social</label>
                  <input 
                    type="text" 
                    placeholder="Razón Social" 
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row">
                  <label>Dirección fiscal</label>
                  <input 
                    type="text" 
                    placeholder="Dirección fiscal" 
                    value={direccionFiscal}
                    onChange={(e) => setDireccionFiscal(e.target.value)}
                    required 
                  />
                </div>
              </div>
            )}
          </div>

          <PaymentGateway totalAmount={totalAmount} onMethodChange={setPaymentMethod} />
        </div>

        {/* Sección derecha - Resumen + Preview del comprobante */}
        <div className="checkout-section summary">
          <h2>Tu Pedido ({pedidosCount})</h2>
          
          <div className="summary-row"><span>Subtotal</span><span>S/ {totalAmount.toFixed(2)}</span></div>
          <div className="summary-row"><span>Envío</span><span>{deliveryType === 'delivery' ? 'S/ 15.00' : 'Gratis'}</span></div>
          <div className="summary-row total"><span>Total a pagar</span><span>S/ {(totalAmount + (deliveryType === 'delivery' ? 15 : 0)).toFixed(2)}</span></div>

          {/* Preview del comprobante (como una "tarjeta") */}
          <div className="comprobante-preview">
            <h4>Comprobante a emitir</h4>
            <p><strong>Tipo:</strong> {comprobanteTipo === 'boleta' ? 'Boleta Electrónica' : 'Factura Electrónica'}</p>
            
            {comprobanteTipo === 'boleta' ? (
              <p><strong>DNI:</strong> {usuario.dni || 'No registrado'}</p>
            ) : (
              <>
                <p><strong>RUC:</strong> {ruc || 'Pendiente'}</p>
                <p><strong>Razón Social:</strong> {razonSocial || 'Pendiente'}</p>
              </>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="btn-confirm-order" disabled={saving}>
            {saving ? 'Procesando...' : 'Confirmar y Pagar'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;