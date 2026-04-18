import type { Producto } from './producto';

export interface DetallePedido {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  producto?: Producto;
}

export interface DireccionEnvio {
  calle: string;
  distrito: string;
  referencia: string;
}

export interface SeguimientoPedido {
  estado: string;
  fecha: string;
  mensaje: string;
}

export interface Pedido {
  id: string;
  usuario_id: string;
  fecha: string;
  total: number;
  tipo_entrega: 'recojo_tienda' | 'delivery';
  metodo_pago: string;
  estado_actual: string;
  estado_de_compra?: string;
  direccion_envio?: DireccionEnvio;
  seguimiento: SeguimientoPedido[];
  detalles?: DetallePedido[];
}
