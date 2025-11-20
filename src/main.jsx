/**
 * Listenable Socials - Main Entry Point
 *
 * This file serves as the main entry point for the Listenable Socials React application.
 * It initializes the React app with strict mode for development warnings and renders
 * the main App component into the DOM.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create and render the React application
// StrictMode helps identify potential problems in the application during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
