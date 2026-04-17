// services/ProductoService.ts
import type { Producto, Categoria } from '../types/producto';
import { apiService } from './ApiService';

const normalizarSlug = (texto: string) => {
  const valor = texto.toLowerCase();
  if (valor.includes('pc')) return 'pc';
  if (valor.includes('laptop')) return 'laptop';
  if (valor.includes('accesorio')) return 'accesorio';
  return valor.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const mapCategorias = (categorias: Categoria[]): Categoria[] => {
  return categorias.map((categoria) => ({
    ...categoria,
    slug: normalizarSlug(categoria.nombre),
  }));
};

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const db = await apiService.fetchBaseDeDatos();
    return db.productos;
  },

  getById: async (id: string): Promise<Producto | undefined> => {
    const db = await apiService.fetchBaseDeDatos();
    return db.productos.find((producto) => producto.id === id);
  },

  getCategorias: async (): Promise<Categoria[]> => {
    const db = await apiService.fetchBaseDeDatos();
    return mapCategorias(db.categorias);
  },

  getByCategoria: async (categoriaIdOrSlug: string): Promise<Producto[]> => {
    const db = await apiService.fetchBaseDeDatos();
    const categorias = mapCategorias(db.categorias);
    const categoria = categorias.find(
      (item) => item.id === categoriaIdOrSlug || item.slug === categoriaIdOrSlug,
    );
    if (!categoria) {
      return [];
    }
    return db.productos.filter((producto) => producto.categoria === categoria.id);
  },
};
export default productoService;