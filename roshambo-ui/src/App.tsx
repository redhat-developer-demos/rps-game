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
import RoshamboLogo from './assets/2023_Roshambo_UI__Roshambo_Logo_Descrip_W.svg'


function App() {
  const [ state ] = useActor(useContext(StateMachineContext))

  if (!state.context.config || !state.context.user) {
    // If the config isn't loaded, then the user probably came directly here
    // without visiting the instructions page
    return <Navigate to="/"></Navigate>
  }

  let content!: JSX.Element

  log(`current state machine state is "${state.value}". context is:`, state.context)

  switch (state.value) {
    case 'READY':
      content = <Waiting message='The game will resume soon...'></Waiting>
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
      content = (<h2>Loading...</h2>)
      break
  }

  const teamColour = state.context.user.team === 1 ? 'bg-red' : 'bg-blue'

  return (
    <div className='grid grid-rows-6 grid-flow-row p-4 px-7 text-white container' id="app-container">
      <img src={RoshamboLogo} alt="Roshambo Game Logo" />
      <div className={`row-span-1 items-center inset-x-0 p-3 my-6 text-white flex rounded-md px-6 ${teamColour}`}>
        <p className='flex-1 text-xl text-left'>{ state.context.user ? state.context.user.name : '...' }</p>
        <p className='flex-1 text-xl text-right'>Team #{ state.context.user ? state.context.user.team : '...' }</p>
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
