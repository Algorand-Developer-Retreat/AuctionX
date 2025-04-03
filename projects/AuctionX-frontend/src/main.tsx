import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'
import ErrorBoundary from './components/ErrorBoundary'
import { Buffer } from 'buffer'

window.global = window
window.Buffer = Buffer

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode> 
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
