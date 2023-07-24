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
import TitlePage from './TitlePage.tsx';
import LandscapeBlocker from './LandscapeBlocker.tsx';
import ReadinessCheck from './ReadinessCheck.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TitlePage/>,
  },
  {
    path: '/instructions',
    element: <ReadinessCheck><InstructionsPage/></ReadinessCheck>,
  },
  {
    path: '/play',
    element: <ReadinessCheck><App/></ReadinessCheck>
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LandscapeBlocker>
      <HeightWrapper>
        <div className='flex w-full mx-auto grow'>
          <StateMachineContextProvider>
            <RouterProvider router={router} />
          </StateMachineContextProvider>
        </div>
      </HeightWrapper>
    </LandscapeBlocker>
  </React.StrictMode>
)
