import './App.css'
import { useContext } from 'react';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import Capture from './Capture';
import log from 'barelog'
import Waiting from './Waiting';
import MoveProcessed from './MoveProcessed';
import { Navigate } from 'react-router-dom'
import GameOver from './GameOver';


function App() {
  const [ state ] = useActor(useContext(StateMachineContext))

  if (!state.context.config) {
    // If the config isn't loaded, then the user probably came directly here
    // without visiting the instructions page
    return <Navigate to="/"></Navigate>
  }

  let content: JSX.Element = (<h2>Loading...</h2>)
  
  log(`current state machine state is "${state.value}". context is:`, state.context)

  switch (state.value) {
    case 'READY':
      content = <Waiting message='The game will begin soon...'></Waiting>
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
    case 'ROUND_RESULT':
      content = <Waiting message={'Next round will begin soon!'}/>
      break
    case 'INITIAL':
      content = <Waiting message='Initializing'></Waiting>
      break
    case 'GAME_OVER':
      content = <GameOver />
      break;
    default:
      break
  }

  return (
    <div className='grid grid-rows-6 grid-flow-row p-4 text-white container' id="app-container">
      <div className='row-span-1 items-center inset-x-0 p-3 my-6 bg-red-600 text-white flex rounded-md border-red-400 border-2'>
        <p className='flex-1 text-left'><strong>{ state.context.user ? state.context.user.name : '...' }</strong></p>
        <p className='flex-1 text-right'><strong>Team #{ state.context.user ? state.context.user.team : '...' }</strong></p>
      </div>
      <div className='row-span-5 -mt-4'>
        {content}
      </div>
      {/* <div className="my-6">
        <GameRules open={true}/>
      </div> */}
    </div>
  );
}

export default App;
