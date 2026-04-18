import { useEffect, useState } from 'react';
import pedidosService from '../services/PedidosService';
import type { Pedido } from '../types/pedido';

export type CheckoutStage = 'list' | 'form' | 'success';

export const useCheckout = (usuarioId: string | null, authReady: boolean) => {
  const [pendingOrders, setPendingOrders] = useState<Pedido[]>([]);
  const [stage, setStage] = useState<CheckoutStage>('list');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPendingOrders = async () => {
    if (!authReady || !usuarioId) {
      setPendingOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const pedidos = await pedidosService.getPendingPedidosConDetallesByUsuarioId(usuarioId);
      setPendingOrders(pedidos);
    } catch (err) {
      setError('No se pudieron cargar los pedidos pendientes.');
      setPendingOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady) {
      return;
    }

    fetchPendingOrders();
  }, [usuarioId, authReady]);

  const continueToForm = () => {
    if (pendingOrders.length === 0) {
      setError('No hay pedidos pendientes por pagar.');
      return;
    }

    setError(null);
    setStage('form');
  };

  const completeCheckout = async (data: {
    correo: string;
    tipo_entrega: 'delivery' | 'recojo_tienda';
    distrito: string;
    direccion: string;
    referencia: string;
  }) => {
    if (pendingOrders.length === 0) {
      setError('No hay pedidos pendientes por pagar.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await Promise.all(
        pendingOrders.map((order) => {
          const seguimiento = [
            ...(order.seguimiento ?? []),
            {
              estado: 'confirmado',
              fecha: new Date().toISOString(),
              mensaje: 'Pedido confirmado y en proceso de preparación.',
            },
          ];

          return pedidosService.updatePedido(order.id, {
            tipo_entrega: data.tipo_entrega,
            direccion_envio: {
              calle: data.direccion,
              distrito: data.distrito,
              referencia: data.referencia,
            },
            estado_actual: 'confirmado',
            estado_de_compra: 'pagado',
            seguimiento,
          });
        })
      );

      setSuccessMessage('Todos tus pedidos pendientes fueron confirmados correctamente.');
      setStage('success');
      window.dispatchEvent(new Event('pendingOrdersUpdated'));
    } catch (err) {
      setError('No se pudo completar el proceso de compra. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const resetStage = () => {
    setStage('list');
    setSuccessMessage(null);
    fetchPendingOrders();
  };

  return {
    pendingOrders,
    stage,
    loading,
    saving,
    error,
    successMessage,
    continueToForm,
    completeCheckout,
    resetStage,
  };
};

export default useCheckout;
