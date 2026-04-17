import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ProductosProvider } from './context/ProductosContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductosProvider>
        <App />
      </ProductosProvider>
    </AuthProvider>
  </React.StrictMode>,
)