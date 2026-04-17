// context/ProductosContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto, Categoria } from '../types/producto';
import { productoService } from '../services/ProductoService';

interface ProductosContextType {
  productos: Producto[];
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
}

export const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export const ProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          productoService.getAll(),
          productoService.getCategorias(),
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (err) {
        setError('No se pudo cargar la información de productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void cargarDatos();
  }, []);

  return (
    <ProductosContext.Provider value={{ productos, categorias, loading, error }}>
      {children}
    </ProductosContext.Provider>
  );
};
