import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={(import.meta as any).env?.BASE_URL ?? '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)