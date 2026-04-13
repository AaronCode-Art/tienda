// context/ProductosContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../types'; // Importamos el tipo Producto
import data from '../../bd.json';

interface ProductosContextType {
  productos: Producto[];
}

export const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export const ProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    // Por ahora cargamos del JSON. 
    // Cuando uses MySQL, aquí harás el fetch a tu API. 🔌
    setProductos(data.productos);
  }, []);

  return (
    <ProductosContext.Provider value={{ productos }}>
      {children}
    </ProductosContext.Provider>
  );
};