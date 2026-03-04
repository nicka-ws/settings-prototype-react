import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { mountVercelToolbar } from '@vercel/toolbar/vite'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

mountVercelToolbar()
