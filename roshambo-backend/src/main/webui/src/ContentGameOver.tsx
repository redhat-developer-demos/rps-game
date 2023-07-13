import { useActor } from '@xstate/react'
import React, { useContext } from 'react'
import { StateMachineContext } from './StateMachineProvider'

const ContentGameOver: React.FunctionComponent = () => {
  const [ state ] = useActor(useContext(StateMachineContext))
  
  let message = 'Congratulations to the Roshambo champions! 🎉'

  if (state.context.endResult === 'TIE') {
    message = 'Better luck next time 🤞'
  }

  return (
    <div className='flex w-full items-center'>
      <div className="flex-1">
        <p className='text-2xl'>
          {message}
        </p>
      </div>
    </div>
  )
}

export default ContentGameOver