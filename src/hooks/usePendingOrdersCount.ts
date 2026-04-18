import { useEffect, useState } from 'react';
import pedidosService from '../services/PedidosService';

export const usePendingOrdersCount = (usuarioId: string | null, authReady: boolean) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      if (!authReady || !usuarioId) {
        setCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const pendientes = await pedidosService.getPendingPedidosByUsuarioId(usuarioId);
        setCount(pendientes.length);
      } catch (error) {
        console.error('Error al cargar pedidos pendientes:', error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();

    const handler = () => {
      fetchCount();
    };

    window.addEventListener('pendingOrdersUpdated', handler);
    return () => {
      window.removeEventListener('pendingOrdersUpdated', handler);
    };
  }, [usuarioId, authReady]);

  return { count, loading };
};

export default usePendingOrdersCount;
