import './Capture.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { SSEContentEnable, Shape, ShotResult } from './Api';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import { IconContext } from 'react-icons'
import { FiSend, FiCamera } from 'react-icons/fi';

import shapeRock from './assets/rock.png'
import shapeScissors from './assets/scissors.png'
import shapePaper from './assets/paper.png'
import VideoCaptureComponent from './CaptureVideo';

type CaptureComponentProps = {
  userId: number
  team: number
  roundInfo: SSEContentEnable
}

const Capture: React.FunctionComponent<CaptureComponentProps> = (props) => {
  // TODO: maybe consider extracting video into it's own component
  const [ , send ] = useActor(useContext(StateMachineContext))
  const [ videoEnabled, setVideoEnabled ] = useState<boolean>(false);
  const [ move, setMove ] = useState<Shape>();
  const [ request, setRequest ] = useState<Promise<Response>>()

  async function submitMove(imageData?: string) {
    if (imageData) {
      alert('Submit move!')
      setVideoEnabled(false)
    } else if (move) {
      const _request = fetch(`/game/detect/button/${props.team}/${props.userId}/${move}`, {
        method: 'POST',
      })

      // Show a the waiting/loading screen while API is processing the request
      send({
        type: 'PAUSE',
        data: 'Processing your move...'
      })

      setTimeout(() => {
        _request
          .then((res) => res.json())
          .then((data) => send({ type: 'MOVE_PROCESSED', data }))
          .catch(() => {
            alert('error processing move')
          })
  
        setRequest(_request)
      }, 1000)
    } else {
      alert('unexpected condition')
    }
  }

  let content!: JSX.Element
  if (videoEnabled) {
    content = (
      <VideoCaptureComponent callback={(data) => submitMove(data)}/>
    )
  } else {
    content = (
      <div>
        <div className="grid grid-cols-3 justify-center">
          <button className={`shape-selector ${move === Shape.Rock ? 'red' : ''}`} onClick={() => setMove(Shape.Rock)} >
            <img src={shapeRock} alt="rock" />
            <small>Rock</small>
          </button>
          <button className={`shape-selector ${move === Shape.Paper ? 'red' : ''}`} onClick={() => setMove(Shape.Paper)} >
            <img src={shapePaper} alt="paper" />
            <small>Paper</small>
          </button>
          <button className={`shape-selector ${move === Shape.Scissors ? 'red' : ''}`} onClick={() => setMove(Shape.Scissors)} >
            <img src={shapeScissors} alt="scissors" />
            <small>Scissors</small>
          </button>
        </div>
        <br />
        <button className={`rounded-md m-2 p-4 hover:bg-green-600 bg-green-500 ${move ? 'opacity-100' : 'opacity-50'}`} disabled={move === undefined} onClick={() => submitMove()}>
          <span>Submit Move &nbsp;</span>
          <IconContext.Provider value={{ style: { display: 'inline' } }}>
            <FiSend></FiSend>
          </IconContext.Provider>
        </button>
        <button className={`rounded-md m-2 p-4 hover:bg-green-600 bg-green-500`} onClick={() => setVideoEnabled(true)}>
          <span>Use Camera &nbsp;</span>
          <IconContext.Provider value={{ style: { display: 'inline' } }}>
            <FiCamera></FiCamera>
          </IconContext.Provider>
        </button>
      </div>
    )
  }

  return (
    <div className='text-white grid mt-[20vh] content-center'>
      {content}
    </div>
  );
}

export default Capture;
