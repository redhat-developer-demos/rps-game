import './App.css'
import InstructionsPage from "./Instructions";
import { useContext } from 'react';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import Capture from './Capture';
import log from 'barelog'
import Waiting from './Waiting';
import MoveProcessed from './MoveProcessed';

function App() {
  const [ state ] = useActor(useContext(StateMachineContext))
  let content: JSX.Element = (<h2>Loading...</h2>)
  
  log('current state machine state:', state.value)

  switch (state.value) {
    case 'READY':
      content = <InstructionsPage username={state.context.user.name}></InstructionsPage>
      break
    case 'PLAY':
      content = <Capture
        roundInfo={state.context.roundInfo}
        userId={state.context.user.id}
        team={state.context.user.team}/>
      break
    case 'PAUSED':
      content = <Waiting message={state.context.waitingMessage}/>
      break
    case 'MOVE_RESULT':
      content = <MoveProcessed data={state.context.processedMoveResponse} />
      break
    default:
      break
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
        {content}
      </div>
    </>
  );
}

export default App;
