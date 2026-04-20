import React, { useState } from 'react';
import { FaCreditCard, FaBarcode, FaCheckCircle } from 'react-icons/fa';
import './PaymentGateway.css';

interface PaymentGatewayProps {
  totalAmount: number;
  onMethodChange: (method: 'tarjeta' | 'pagoefectivo') => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ totalAmount, onMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState<'tarjeta' | 'pagoefectivo'>('tarjeta');

  const handleMethodSelect = (method: 'tarjeta' | 'pagoefectivo') => {
    setSelectedMethod(method);
    onMethodChange(method);
  };

  return (
    <div className="payment-gateway">
      <h3>Método de Pago</h3>
      <div className="payment-options">
        <div 
          className={`payment-card ${selectedMethod === 'tarjeta' ? 'active' : ''}`}
          onClick={() => handleMethodSelect('tarjeta')}
        >
          <FaCreditCard className="payment-icon" />
          <span>Tarjeta de Crédito/Débito</span>
          {selectedMethod === 'tarjeta' && <FaCheckCircle className="check-badge" />}
        </div>

        <div 
          className={`payment-card ${selectedMethod === 'pagoefectivo' ? 'active' : ''}`}
          onClick={() => handleMethodSelect('pagoefectivo')}
        >
          <FaBarcode className="payment-icon" />
          <span>PagoEfectivo</span>
          {selectedMethod === 'pagoefectivo' && <FaCheckCircle className="check-badge" />}
        </div>
      </div>

      <div className="payment-details-container">
        {selectedMethod === 'tarjeta' ? (
          <div className="card-form-simulation">
            <div className="form-group-row">
              <input type="text" placeholder="Número de tarjeta" className="form-input" maxLength={16} />
            </div>
            <div className="form-group-row multi">
              <input type="text" placeholder="MM/AA" className="form-input" maxLength={5} />
              <input type="password" placeholder="CVV" className="form-input" maxLength={3} />
            </div>
            <input type="text" placeholder="Nombre en la tarjeta" className="form-input" />
            <p className="payment-hint">Pago seguro encriptado con SSL</p>
          </div>
        ) : (
          <div className="pagoefectivo-simulation">
            <p>Se generará un código <strong>CIP</strong> para que puedas pagar en cualquier agente o banca por internet.</p>
            <div className="cip-preview">
              <span>Monto a depositar:</span>
              <span className="amount">S/ {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;