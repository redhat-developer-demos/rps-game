import './IconRow.css'
import React from 'react'
import rockIcon from './assets/rock.png'
import scissorsIcon from './assets/scissors.png'
import paperIcon from './assets/paper.png'

const Waiting: React.FunctionComponent<{ animated: boolean }> = ({ animated }) => {
  const classPrefix = `float ${animated ? 'animated' : ''}`

  return (
    <div>
      <div className="grid grid-cols-3">
        <img className={`${classPrefix} rock`} src={rockIcon} alt="rock icon" />
        <img className={`${classPrefix} paper`} src={paperIcon} alt="paper icon" />
        <img className={`${classPrefix} scissors`} src={scissorsIcon} alt="scissors icon" />
      </div>
    </div>
  );
}

export default Waiting