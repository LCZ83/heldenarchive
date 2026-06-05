import React from 'react'
import ReactDOM from 'react-dom/client'
import { installStorage } from './storage.js'
import App from './HeldenArchiv.jsx'
import './index.css'

// Install the localStorage-backed window.storage shim BEFORE the app mounts,
// so every storage call in the app finds window.storage already present.
installStorage()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
