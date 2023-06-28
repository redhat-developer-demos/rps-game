import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import "@fontsource/red-hat-display";
import "@fontsource/red-hat-display/500.css";
import "@fontsource/red-hat-display/600.css";
import "@fontsource/red-hat-display/700.css";
import StateMachineContextProvider from './StateMachineProvider.tsx'
import InstructionsPage from './Instructions.tsx';
import HeightWrapper from './HeightWrapper.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <InstructionsPage/>,
  },
  {
    path: '/play',
    element: <App/>
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HeightWrapper>
    <div className='bg-gray-800 h-full text-xl'>
      <React.StrictMode>
        <StateMachineContextProvider>
          <RouterProvider router={router} />
        </StateMachineContextProvider>
      </React.StrictMode>
    </div>
  </HeightWrapper>
)
