import { useActor } from '@xstate/react'
import React, { useContext, useState } from 'react'
import { advanceRound, startGame } from './Api'
import { StateMachineContext } from './StateMachineProvider'
import NextRoundIcons from './assets/2023_Roshambo_UI__Next_round_icons.svg'

const ContentReady: React.FunctionComponent = () => {
  const [ state ] = useActor(useContext(StateMachineContext))
  const [ btnState, setBtnState ] = useState(false)

  let button: JSX.Element

  async function onButtonClicked () {
    setBtnState(true)

    try {
      if (state.value === 'READY' && state.context.initialState === 'STOP' || state.value !== 'READY' && state.value !== 'GAME_OVER') {
        // This is a little hacky, but we need to handle a page reload. On a
        // reload the machine enters the "READY" state, but we need check if
        // the initial state is STOP since that means a game was in progress
        // and we need to call advanceRound instead of startGame...could the
        // server simply handle this? 
        await advanceRound()
      } else {
        await startGame()
      }
    } catch (e: unknown) {
      alert(`Failed to start/advance round. Check the console for more details: ${e}`)
    } finally {
      setBtnState(false)
    }
  }

  const commonClasses = 'w-36 h-36 rounded-full cursor-pointer text-white text-xl py-2 px-4 rounded'
  const icons = <img src={NextRoundIcons} alt="Rock Paper Scissors Icons" />

  if (state.value === 'GAME_OVER' || state.value === 'READY' && state.context.initialState !== 'STOP') {
    button = <button disabled={btnState} onClick={onButtonClicked} className={`${commonClasses} bg-black hover:opacity-90`}>{icons} New Game</button>
  } else if (state.value === 'PLAY') {
    button = <button disabled className={`${commonClasses} bg-black`}>{icons}Please Wait&nbsp; ⏱️</button>
  } else {
    button = <button disabled={btnState} onClick={onButtonClicked} className={`${commonClasses} bg-black hover:opacity-90`}>{icons} Next Round</button>
  }
  
  return (
    <div className='flex w-full items-center'>
      <div className="flex-1">
        {button}
      </div>
    </div>
  )
}

export default ContentReady