// hooks/useProductos.ts
import { useContext } from 'react';
import { ProductosContext } from '../context/ProductosContext';
import type { Producto, Categoria } from '../types/producto';

export const useProductos = () => {
  const context = useContext(ProductosContext);

  if (!context) {
    throw new Error('useProductos debe usarse dentro de un ProductosProvider');
  }

  const { productos, categorias, loading, error } = context;

  const obtenerAleatorios = (lista = productos) => {
    return [...lista].sort(() => Math.random() - 0.5);
  };

  const obtenerCategorias = (): Categoria[] => {
    return categorias;
  };

  const filtrarPorCategoria = (categoriaIdOrSlug: string) => {
    const categoria = categorias.find(
      (item) => item.id === categoriaIdOrSlug || item.slug === categoriaIdOrSlug,
    );
    if (!categoria) {
      return [];
    }
    return productos.filter((producto) => producto.categoria === categoria.id);
  };

  const obtenerPorCategoria = (categoriaIdOrSlug: string): Producto[] => {
    return filtrarPorCategoria(categoriaIdOrSlug);
  };

  return {
    productos,
    loading,
    error,
    obtenerAleatorios,
    obtenerCategorias,
    filtrarPorCategoria,
    obtenerPorCategoria,
  };
};
export default useProductos;
