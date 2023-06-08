import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import GameStateContextProvider from './GameStateProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameStateContextProvider>
      <App />
    </GameStateContextProvider>
  </React.StrictMode>,
)
