import type { Usuario } from '../types/usuario';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:3001';

export const usuarioService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await fetch(`${AUTH_API_URL}/usuarios`);
    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de usuarios.');
    }
    return await response.json();
  },

  login: async (correo: string, contrasena: string): Promise<Usuario | null> => {
    const params = new URLSearchParams({ correo, contrasena });
    const response = await fetch(`${AUTH_API_URL}/usuarios?${params.toString()}`);
    if (!response.ok) {
      return null;
    }
    const usuarios = await response.json();
    return usuarios[0] ?? null;
  },

  register: async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const response = await fetch(`${AUTH_API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error durante el registro.' }));
      throw new Error(errorBody.message ?? 'Error durante el registro.');
    }

    return await response.json();
  },
};

export default usuarioService;
