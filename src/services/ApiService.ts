import type { BaseDeDatos } from '../types/producto';

const DATABASE_URL = '/bd.json';
let cache: BaseDeDatos | null = null;

const fetchBaseDeDatos = async (): Promise<BaseDeDatos> => {
  if (cache) {
    return cache;
  }

  const response = await fetch(DATABASE_URL);
  if (!response.ok) {
    throw new Error(`No se pudo cargar bd.json (${response.status})`);
  }

  const data = (await response.json()) as BaseDeDatos;
  cache = data;
  return data;
};

export const apiService = {
  fetchBaseDeDatos,
};

export default apiService;
