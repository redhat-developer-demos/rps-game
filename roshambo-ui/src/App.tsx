import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './Homepage';
import InstructionsPage from "./Instructions";
import Capture from "./Capture";
import Results from "./Results";
import { useContext } from 'react';
import { GameStateContext } from './GameStateProvider';
import log from 'barelog'

function App() {
  const ctx = useContext(GameStateContext)

  let content: JSX.Element = <h2>Loading...</h2>

  if (ctx.ready) {
    content = (
      <Routes>
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/capture" element={<Capture team={ctx.user.team} userId={ctx.user.id} />} />
        <Route path="/results" element={<Results />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    )
  }

  return (
    <>
      <div className='user-info'>
        <p>Username: <strong>{ ctx.ready ? ctx.user.name : '...' }</strong></p>
        <p>Team: <strong>{ ctx.ready ? ctx.user.team : '...' }</strong></p>
      </div>
      <Router>
        <h1>Rock, Paper, Scissors!</h1>
        {content}
      </Router>
    </>
  );
}

export default App;
