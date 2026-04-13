import React, { useState, useMemo } from 'react';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import TarjetaProducto from '../../components/productos/TarjetaProducto';
import { useProductos } from '../../hooks/useProductos'; 
import './productospage.css';

const ProductosPage: React.FC = () => {
  const { productos } = useProductos();
  
  // 1. Estados para los filtros
  const [categoria, setCategoria] = useState<'todos' | 'pc' | 'laptop' | 'accesorio'>('todos');
  const [precioMax, setPrecioMax] = useState<number>(1000); // Valor inicial alto

  // 2. Lógica de filtrado combinada (Categoría + Precio)
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const coincideCategoria = categoria === 'todos' || p.categoria === categoria;
      const coincidePrecio = p.precio <= precioMax;
      return coincideCategoria && coincidePrecio;
    });
  }, [productos, categoria, precioMax]);

  return (
    <div className="productos-page">
      <Encabezado showBanner={true} />

      <main className="productos-layout-principal">
        {/* BARRA LATERAL */}
        <aside className="sidebar-filtros">
          <h2 className="titulo-filtro">filtrado</h2>
          
          {/* FILTRO DE CATEGORÍAS */}
          <div className="grupo-filtros">
            <h3>Categorías</h3>
            <ul>
              {['todos', 'pc', 'laptop', 'accesorio'].map((cat) => (
                <li key={cat}>
                  <button 
                    className={categoria === cat ? 'active' : ''} 
                    onClick={() => setCategoria(cat as any)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <hr className="separador-filtro" />

          {/* MEDIDOR DE PRECIO */}
          <div className="grupo-filtros">
            <h3>Rango de Precio</h3>
            <div className="price-slider-container">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={precioMax} 
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-labels">
                <span>S/ 0</span>
                <span className="current-price">S/ {precioMax}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENIDO DE PRODUCTOS */}
        <section className="catalogo-seccion">
          <h1 className="titulo-pagina">Productos</h1>
          
          <div className="productos-grid-catalogo">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((item) => (
                <TarjetaProducto key={item.id} producto={item} />
              ))
            ) : (
              <div className="no-productos">
                <p>No se encontraron productos que coincidan con los filtros.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductosPage;