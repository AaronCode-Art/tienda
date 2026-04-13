// components/SeccionCategorias.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Categoria } from '../types';
import './SeccionCategorias.css'; // Si quieres agregar estilos específicos

interface PropsCategorias {
  categorias: Categoria[];
}

const SeccionCategorias: React.FC<PropsCategorias> = ({ categorias }) => {
  return (
    <section className="categorias-seccion">
      <div className="categorias-contenedor">
        <h2 className="categorias-titulo">Categorías</h2>
        
        <div className="categorias-cuadricula">
          {categorias.map((categoria) => (
            <Link 
              key={categoria.id} 
              to={`/categoria/${categoria.id}`} 
              className="categoria-enlace"
            >
              <img 
                src={categoria.imagenUrl} 
                alt={categoria.nombre} 
                className="categoria-imagen" 
              />
              <p className="categoria-nombre">{categoria.nombre}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeccionCategorias;