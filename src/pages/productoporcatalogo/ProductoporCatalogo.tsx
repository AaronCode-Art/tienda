import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import TarjetaProducto from '../../components/productos/TarjetaProducto';
import { useProductos } from '../../hooks/useProductos';
import './ProductoporCatalogo.css';

const ProductoporCatalogo: React.FC = () => {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const { obtenerCategorias, obtenerPorCategoria } = useProductos();

  const categorias = obtenerCategorias();
  const categoria = categorias.find((item) => item.id === categoriaId);
  const productosCategoria = categoriaId ? obtenerPorCategoria(categoriaId) : [];

  return (
    <div className="catalogo-categoria-page">
      <Encabezado showBanner={false} />

      <main className="catalogo-categoria-contenido">
        <header className="catalogo-categoria-header">
          <div>
            <p className="catalogo-subtitulo">Categoría</p>
            <h1 className="catalogo-titulo">{categoria ? categoria.nombre : 'Categoría no encontrada'}</h1>
            <p className="catalogo-descripcion">
              {categoria 
                ? `Explora los productos disponibles en la categoría ${categoria.nombre}.` 
                : 'No se encontró la categoría seleccionada. Por favor vuelve al inicio.'}
            </p>
          </div>
          <Link to="/" className="catalogo-boton-volver">Volver al inicio</Link>
        </header>

        {categoria ? (
          productosCategoria.length > 0 ? (
            <div className="catalogo-categoria-grid">
              {productosCategoria.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="catalogo-no-productos">
              <p>No hay productos disponibles en esta categoría.</p>
            </div>
          )
        ) : (
          <div className="catalogo-no-productos">
            <p>Selecciona una categoría válida desde el inicio.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductoporCatalogo;
