import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { Usuario } from '../types/usuario';
import { usuarioService } from '../services/UsuarioService';

interface AuthContextType {
  usuario: Usuario | null;
  authReady: boolean;
  login: (correo: string, contrasena: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('authUsuario');
    if (stored) {
      try {
        setUsuario(JSON.parse(stored));
      } catch {
        localStorage.removeItem('authUsuario');
      }
    }
    setAuthReady(true);
  }, []);

  const login = async (correo: string, contrasena: string): Promise<boolean> => {
    const user = await usuarioService.login(correo, contrasena);
    if (user) {
      setUsuario(user);
      localStorage.setItem('authUsuario', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('authUsuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};
