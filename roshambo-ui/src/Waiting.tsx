import './Waiting.css'
import React from 'react'
// import rpsIconRound from './assets/rock-paper-scissors-round.png'
import rockIcon from './assets/rock.png'
import scissorsIcon from './assets/scissors.png'
import paperIcon from './assets/paper.png'

const Waiting: React.FunctionComponent<{ message?: string }> = ({ message }) => {
  return (
    <div className='waiting items-center'>

      {/* https://codepen.io/t_afif/pen/yLMXBRL */}
      {/* <div className="spinner-5"></div> */}
      
      <div className="animation h-3/6 relative top-1/3 w-full">
        <img className='float rock' src={rockIcon} alt="rock icon" />
        <img className='float paper' src={paperIcon} alt="paper icon" />
        <img className='float scissors' src={scissorsIcon} alt="scissors icon" />
      </div>
      <h2 className='text-white relative top-32 w-full text-center text-xl'>{ message }</h2>
    </div>
  );
}

export default Waiting