import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "@fontsource/red-hat-display";
import "@fontsource/red-hat-display/500.css";
import "@fontsource/red-hat-display/600.css";
import "@fontsource/red-hat-display/700.css";
import StateMachineContextProvider from './StateMachineProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div className='bg-gray-800'>
    <React.StrictMode>
      <StateMachineContextProvider>
          <App />
      </StateMachineContextProvider>
    </React.StrictMode>
  </div>
)
