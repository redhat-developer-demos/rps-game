import './IconRow.css'
import React from 'react'
import rockIcon from './assets/rock.png'
import scissorsIcon from './assets/scissors.png'
import paperIcon from './assets/paper.png'

const Waiting: React.FunctionComponent<{ animated: boolean }> = ({ animated }) => {
  const classPrefix = `float ${animated ? 'animated' : ''}`

  return (
    <div>
      <div className="grid grid-cols-3 md:px-24">
        <img className={`${classPrefix} rock w-24 md:w-28`} src={rockIcon} alt="rock icon" />
        <img className={`${classPrefix} paper w-24 md:w-28`} src={paperIcon} alt="paper icon" />
        <img className={`${classPrefix} scissors w-24 md:w-28`} src={scissorsIcon} alt="scissors icon" />
      </div>
    </div>
  );
}

export default Waiting