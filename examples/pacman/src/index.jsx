import React from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './components/App'
import Overlay from './components/Overlay'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Overlay />
  </>
)
