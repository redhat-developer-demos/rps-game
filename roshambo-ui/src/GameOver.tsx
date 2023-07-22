import { useActor } from '@xstate/react';
import { useContext } from 'react';
import { StateMachineContext } from './StateMachineProvider';

const GameOver: React.FunctionComponent = () => {
  const [ state ] = useActor(useContext(StateMachineContext))

  const { team1Score, team2Score } = state.context.endResult
  const { team } = state.context.user

  let message = 'Tie!'
  let winner!: number

  if (team1Score > team2Score) {
    winner = 1
  } else if (team2Score > team1Score) {
    winner = 2
  }

  if (winner ) {
    if (winner === team) {
      message = 'Congratulations, your team won! 🎉'
    } else {
      message = 'Sorry, your team lost!'
    }
  }
  
  return (
    <div className='text-white h-full grid content-center'>
      <h2 className='text-3xl leading-10'>{ message }</h2>
    </div>
  );
}

export default GameOver;
