import './App.css'
import InstructionsPage from "./Instructions";
import { useContext } from 'react';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import Capture from './Capture';
import log from 'barelog'

function App() {
  const [ state ] = useActor(useContext(StateMachineContext))
  let content: JSX.Element = (<h2>Loading...</h2>)
  
  log('current state machine state:', state.value)

  if (state.value === 'READY') {
    content = <InstructionsPage></InstructionsPage>
  }

  if (state.value === 'PLAY') {
    content = <Capture
      roundInfo={state.context.roundInfo}
      userId={state.context.user.id}
      team={state.context.user.team}/>
  }


  // if (ctx.ready) {
  //   if (ctx.roundInfo) {
  //     content = <Capture team={ctx.user.team} userId={ctx.user.id} />
  //   } else if (ctx.lastResult) {
  //     // content =
  //   }
  //   // content = (
  //   //   <Routes>
  //   //     <Route path="/instructions" element={<InstructionsPage />} />
  //   //     <Route path="/capture" element={<Capture team={ctx.user.team} userId={ctx.user.id} />} />
  //   //     <Route path="/results" element={<Results />} />
  //   //     <Route path="/" element={<HomePage />} />
  //   //   </Routes>
  //   // )
  // }

  return (
    <>
      <div className='user-info'>
        <p>Username: <strong>{ state.context.user ? state.context.user.name : '...' }</strong></p>
        <p>Team: <strong>{ state.context.user ? state.context.user.team : '...' }</strong></p>
      </div>
      <div>
        <h1>Rock, Paper, Scissors!</h1>
        {content}
      </div>
    </>
  );
}

export default App;
