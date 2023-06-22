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
  log('current state machine context:', state.context)

  switch (state.value) {
    case 'READY':
      content = <InstructionsPage></InstructionsPage>
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
    case 'INITIAL':
      content = <Waiting message='Initializing'></Waiting>
      break
    default:
      break
  }

  return (
    <div className='p-4 text-white text-xl container' id="app-container">
      <div className='inset-x-0 p-3 my-2 bg-red-600 text-white flex rounded-md border-red-400 border-2'>
        <p className='flex-1 text-left'><strong>{ state.context.user ? state.context.user.name : '...' }</strong></p>
        <p className='flex-1 text-right'><strong>Team #{ state.context.user ? state.context.user.team : '...' }</strong></p>
      </div>
      <div>
        {content}
      </div>
    </div>
  );
}

export default App;
