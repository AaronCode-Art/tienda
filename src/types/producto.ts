export interface Producto {
  id: string;
  categoria: string;
  marca: string;
  modelo: string;
  nombre: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  descripcion: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  imagenUrl: string;
  slug?: string;
}

export interface BaseDeDatos {
  categorias: Categoria[];
  productos: Producto[];
  usuarios: import('./usuario').Usuario[];
}
