// services/ProductoService.ts
import data from '../../bd.json';
import type { Producto } from '../types';

export const productoService = {
  // En el futuro, esto será: return fetch('api/productos')...
  getAll: (): Producto[] => {
    return data.productos;
  },
  
  getById: (id: string): Producto | undefined => {
    return data.productos.find(p => p.id === id);
  }
};
export default productoService;