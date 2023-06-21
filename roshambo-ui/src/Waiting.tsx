import './Waiting.css'
import React from 'react'
// import rpsIconRound from './assets/rock-paper-scissors-round.png'
import rockIcon from './assets/rock.png'
import scissorsIcon from './assets/scissors.png'
import paperIcon from './assets/paper.png'

const Waiting: React.FunctionComponent<{ message?: string }> = ({ message }) => {
  return (
    <div className='waiting'>
      <h2 className='pb-2 text-slate-900 text-xl mb-4'>{ message }</h2>

      {/* https://codepen.io/t_afif/pen/yLMXBRL */}
      {/* <div className="spinner-5"></div> */}
      
      <img className='float rock' src={rockIcon} alt="rock icon" />
      <img className='float paper' src={paperIcon} alt="paper icon" />
      <img className='float scissors' src={scissorsIcon} alt="scissors icon" />
    </div>
  );
}

export default Waiting