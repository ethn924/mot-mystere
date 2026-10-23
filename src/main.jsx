// Point d'entrée : affiche le composant App dans la div "root" de index.html.
// StrictMode aide à repérer des erreurs pendant le développement.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
