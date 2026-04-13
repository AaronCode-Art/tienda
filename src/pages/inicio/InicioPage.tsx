import React from 'react';
import { Link } from 'react-router-dom';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
// IMPORTANTE: Asegúrate que SeccionCategorias sea export default
import SeccionCategorias from '../../components/SeccionCategorias'; 
import TarjetaProducto from '../../components/productos/TarjetaProducto';
import { useProductos } from '../../hooks/useProductos';
import './InicioPage.css';

const InicioPage: React.FC = () => {
  // Extraemos las funciones de tu hook que lee el JSON
  const { obtenerCategorias, obtenerPorCategoria } = useProductos();

  // 1. Obtenemos las categorías reales de tu bd.json
  const todasLasCategorias = obtenerCategorias();

  // 2. Obtenemos los productos y cortamos a solo 4
  const productosPC = obtenerPorCategoria('pc').slice(0, 4);
  const productosLaptops = obtenerPorCategoria('laptop').slice(0, 4);
  const productosAccesorios = obtenerPorCategoria('accesorio').slice(0, 4);

  return (
    <div className="inicio-page">
      {/* Banner con degradado turquesa */}
      <Encabezado showBanner={true} />
      
      {/* Pasamos 'todasLasCategorias' para que NO salga rojo */}
      <SeccionCategorias categorias={todasLasCategorias} />

      <main className="contenido-principal">
        
        {/* SECCIÓN PC */}
        <section className="seccion-productos-inicio">
          <div className="contenedor-fila">
            <h2 className="titulo-categoria">PC</h2>
            <div className="fila-productos">
              {productosPC.map(prod => (
                <div key={prod.id} className="tarjeta-contenedor">
                  <TarjetaProducto producto={prod} />
                </div>
              ))}
              <Link to="/categoria/pc" className="ver-mas">ver más <span>&rarr;</span></Link>
            </div>
          </div>
        </section>

        {/* SECCIÓN LAPTOPS */}
        <section className="seccion-productos-inicio">
          <div className="contenedor-fila">
            <h2 className="titulo-categoria">Laptops</h2>
            <div className="fila-productos">
              {productosLaptops.map(prod => (
                <div key={prod.id} className="tarjeta-contenedor">
                  <TarjetaProducto producto={prod} />
                </div>
              ))}
              <Link to="/categoria/laptop" className="ver-mas">ver más <span>&rarr;</span></Link>
            </div>
          </div>
        </section>

        {/* SECCIÓN ACCESORIOS */}
        <section className="seccion-productos-inicio">
          <div className="contenedor-fila">
            <h2 className="titulo-categoria">Accesorios</h2>
            <div className="fila-productos">
              {productosAccesorios.map(prod => (
                <div key={prod.id} className="tarjeta-contenedor">
                  <TarjetaProducto producto={prod} />
                </div>
              ))}
              <Link to="/categoria/accesorio" className="ver-mas">ver más <span>&rarr;</span></Link>
            </div>
          </div>
        </section>

      </main>

      <Footer/>
    </div>
  );
};

export default InicioPage;