import type { Producto } from '../types/producto';
import type { Pedido, DetallePedido } from '../types/pedido';

const API_URL = 'http://localhost:3001';

export const pedidosService = {
  getAll: async (): Promise<Pedido[]> => {
    const response = await fetch(`${API_URL}/pedidos`);
    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de pedidos.');
    }
    return await response.json();
  },

  getById: async (pedidoId: string): Promise<Pedido | null> => {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  },

  getPedidosByUsuarioId: async (usuarioId: string): Promise<Pedido[]> => {
    const response = await fetch(`${API_URL}/pedidos?usuario_id=${usuarioId}`);
    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de pedidos del usuario.');
    }
    return await response.json();
  },

  getPendingPedidosByUsuarioId: async (usuarioId: string): Promise<Pedido[]> => {
    const response = await fetch(`${API_URL}/pedidos?usuario_id=${usuarioId}&estado_de_compra=pendiente`);
    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de pedidos pendientes.');
    }
    return await response.json();
  },

  getPendingPedidosConDetallesByUsuarioId: async (usuarioId: string): Promise<Pedido[]> => {
    try {
      const pedidos = await pedidosService.getPendingPedidosByUsuarioId(usuarioId);

      const detallePedidosResponse = await fetch(`${API_URL}/detalle_pedidos`);
      const detalles: DetallePedido[] = detallePedidosResponse.ok
        ? await detallePedidosResponse.json()
        : [];

      const productosResponse = await fetch(`${API_URL}/productos`);
      const productos: Record<string, Producto> = {};

      if (productosResponse.ok) {
        const productosArray = await productosResponse.json();
        productosArray.forEach((p: Producto) => {
          productos[p.id] = p;
        });
      }

      return pedidos.map((pedido) => ({
        ...pedido,
        detalles: detalles
          .filter((d) => d.pedido_id === pedido.id)
          .map((d) => ({
            ...d,
            producto: productos[d.producto_id],
          })),
      }));
    } catch (error) {
      console.error('Error al obtener pedidos pendientes con detalles:', error);
      return [];
    }
  },

  createPedido: async (pedido: Omit<Pedido, 'id' | 'detalles'>): Promise<Pedido> => {
    const pedidoConId = {
      ...pedido,
      id: `o${Date.now()}`,
    };

    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedidoConId),
    });

    if (!response.ok) {
      throw new Error('No se pudo crear el pedido.');
    }

    return await response.json();
  },

  createDetallePedido: async (detalle: Omit<DetallePedido, 'id'>): Promise<DetallePedido> => {
    const detalleConId = {
      ...detalle,
      id: `d${Date.now()}${Math.floor(Math.random() * 1000)}`,
    };

    const response = await fetch(`${API_URL}/detalle_pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detalleConId),
    });

    if (!response.ok) {
      throw new Error('No se pudo crear el detalle del pedido.');
    }

    return await response.json();
  },

  updatePedido: async (pedidoId: string, patch: Partial<Omit<Pedido, 'id' | 'detalles'>>): Promise<Pedido> => {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patch),
    });

    if (!response.ok) {
      throw new Error('No se pudo actualizar el pedido.');
    }

    return await response.json();
  },

  updateDetallePedido: async (detalleId: string, patch: Partial<Omit<DetallePedido, 'id'>>): Promise<DetallePedido> => {
    const response = await fetch(`${API_URL}/detalle_pedidos/${detalleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patch),
    });

    if (!response.ok) {
      throw new Error('No se pudo actualizar el detalle del pedido.');
    }

    return await response.json();
  },

  createPedidoConDetalle: async (usuarioId: string, producto: Producto) => {
    const pedidosPendientes = await pedidosService.getPendingPedidosByUsuarioId(usuarioId);
    const pedidoPendiente = pedidosPendientes[0];

    if (!pedidoPendiente) {
      const nuevoPedido = await pedidosService.createPedido({
        usuario_id: usuarioId,
        fecha: new Date().toISOString(),
        total: producto.precio,
        tipo_entrega: 'delivery',
        metodo_pago: 'yape',
        estado_actual: 'pendiente',
        estado_de_compra: 'pendiente',
        seguimiento: [
          {
            estado: 'pendiente',
            fecha: new Date().toISOString(),
            mensaje: 'Pedido registrado y pendiente de procesamiento.',
          },
        ],
      });

      await pedidosService.createDetallePedido({
        pedido_id: nuevoPedido.id,
        producto_id: producto.id,
        cantidad: 1,
        precio_unitario: producto.precio,
      });

      return nuevoPedido;
    }

    const detalles = await pedidosService.getDetallesByPedidoId(pedidoPendiente.id);
    const detalleExistente = detalles.find((detalle) => detalle.producto_id === producto.id);
    let pedidoTotal = pedidoPendiente.total + producto.precio;

    if (detalleExistente) {
      await pedidosService.updateDetallePedido(detalleExistente.id, {
        cantidad: detalleExistente.cantidad + 1,
        precio_unitario: producto.precio,
      });
    } else {
      await pedidosService.createDetallePedido({
        pedido_id: pedidoPendiente.id,
        producto_id: producto.id,
        cantidad: 1,
        precio_unitario: producto.precio,
      });
    }

    await pedidosService.updatePedido(pedidoPendiente.id, {
      total: pedidoTotal,
    });

    return pedidoPendiente;
  },

  getDetallesByPedidoId: async (pedidoId: string): Promise<DetallePedido[]> => {
    const response = await fetch(`${API_URL}/detalle_pedidos?pedido_id=${pedidoId}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  },

  getPedidosConDetallesByUsuarioId: async (usuarioId: string): Promise<Pedido[]> => {
    try {
      const pedidos = await pedidosService.getPedidosByUsuarioId(usuarioId);

      const detallePedidosResponse = await fetch(`${API_URL}/detalle_pedidos`);
      const detalles: DetallePedido[] = detallePedidosResponse.ok
        ? await detallePedidosResponse.json()
        : [];

      const productosResponse = await fetch(`${API_URL}/productos`);
      const productos: Record<string, Producto> = {};

      if (productosResponse.ok) {
        const productosArray = await productosResponse.json();
        productosArray.forEach((p: Producto) => {
          productos[p.id] = p;
        });
      }

      return pedidos.map((pedido) => ({
        ...pedido,
        detalles: detalles
          .filter((d) => d.pedido_id === pedido.id)
          .map((d) => ({
            ...d,
            producto: productos[d.producto_id],
          })),
      }));
    } catch (error) {
      console.error('Error al obtener pedidos con detalles:', error);
      return [];
    }
  },

  getPedidosConDetalles: async (): Promise<Pedido[]> => {
    try {
      const pedidos = await pedidosService.getAll();
      const detallePedidosResponse = await fetch(`${API_URL}/detalle_pedidos`);
      const detalles: DetallePedido[] = detallePedidosResponse.ok
        ? await detallePedidosResponse.json()
        : [];

      const productosResponse = await fetch(`${API_URL}/productos`);
      const productos: Record<string, Producto> = {};

      if (productosResponse.ok) {
        const productosArray = await productosResponse.json();
        productosArray.forEach((p: Producto) => {
          productos[p.id] = p;
        });
      }

      return pedidos.map((pedido) => ({
        ...pedido,
        detalles: detalles
          .filter((d) => d.pedido_id === pedido.id)
          .map((d) => ({
            ...d,
            producto: productos[d.producto_id],
          })),
      }));
    } catch (error) {
      console.error('Error al obtener pedidos con detalles:', error);
      return [];
    }
  },
};

export default pedidosService;
