// hooks/useProductos.ts
import { useContext } from 'react';
import { ProductosContext } from '../context/ProductosContext';
import type { Producto } from '../types/index';
import data from '../../bd.json';
export const useProductos = () => {
  const context = useContext(ProductosContext);
  
  if (!context) {
    throw new Error('useProductos debe usarse dentro de un ProductosProvider');
  }

  const { productos } = context;

  // Función para mezclar productos aleatoriamente
  const obtenerAleatorios = (lista = productos) => {
    return [...lista].sort(() => Math.random() - 0.5);
  };
  
  const obtenerCategorias = () => {
    return data.categorias; // Retorna el array del JSON que pasaste
  };
  // Función para filtrar por categoría (útil para el Inicio)
  const filtrarPorCategoria = (categoriaId: string) => {
    return productos.filter(p => p.categoria === categoriaId);
  };

  const obtenerPorCategoria = (categoriaId: string): Producto[] => {
    return productos.filter(p => p.categoria === categoriaId);
  };

  return {
    productos,
    obtenerAleatorios,
    obtenerCategorias,
    filtrarPorCategoria,
    obtenerPorCategoria,
  };
};
export default useProductos;