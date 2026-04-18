import { useEffect, useState } from 'react';
import pedidosService from '../services/PedidosService';
import type { Pedido } from '../types/pedido';

export const usePedidos = (usuarioId: string | null, authReady: boolean) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!usuarioId) {
      setPedidos([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pedidosService.getPedidosConDetallesByUsuarioId(usuarioId);
        setPedidos(
          data.filter(
            (pedido) =>
              pedido.estado_actual !== 'pendiente' &&
              pedido.estado_de_compra !== 'pendiente'
          )
        );
      } catch (err) {
        setError('No se pudieron cargar los pedidos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [usuarioId, authReady]);

  return { pedidos, loading, error };
};

export default usePedidos;
