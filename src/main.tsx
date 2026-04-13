import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 1. Importamos el Provider que acabamos de crear
import { ProductosProvider } from './context/ProductosContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Envolvemos toda la App */}
    <ProductosProvider>
      <App />
    </ProductosProvider>
  </React.StrictMode>,
)