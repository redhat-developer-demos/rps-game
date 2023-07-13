import { useActor } from '@xstate/react'
import React, { useContext } from 'react'
import { StateMachineContext } from './StateMachineProvider'
import { TeamId } from './Api'

type TeamInfoProps = {
  team: TeamId
}

const TeamInfoPane: React.FunctionComponent<TeamInfoProps> = ({ team }) => {
  const [ state ] = useActor(useContext(StateMachineContext))
  const classes = [team === 'TEAM_1' ? 'bg-red-500' : 'bg-blue-500']

  const results = state.context?.roundResults?.map((result, idx) => {
    const { winner } = result.roundResult 
    
    let resultText: string

    if (winner === 'TIE') {
      resultText = 'TIE'
    } else if (winner === team) {
      resultText = 'WIN'
    } else {
      resultText = 'LOSE'
    }

    return <p key={`round-${idx}`} className='text-xl pb-3 font-semibold'>{resultText}</p>
  })

  if (state.context.endResult && state.context.endResult !== team) {
    classes.push('opacity-20')
  }

  return (
    <div className={`w-1/4 p-6 flex-row text-center items-center rounded-lg ${classes.join(' ')} text-white`}>
      <h2 className="text-2xl flex-1 content-center font-bold pb-16">{team === 'TEAM_1' ? 'Team 1' : 'Team 2'}</h2>
      {results}
    </div>
  )
}

export default TeamInfoPane