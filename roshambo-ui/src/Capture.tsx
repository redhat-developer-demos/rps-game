import './Capture.css'
import { useContext, useState } from 'react'
import { SSEContentEnable, Shape } from './Api';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import { IconContext } from 'react-icons'
import { FiSend } from 'react-icons/fi';

import shapeRock from './assets/rock.png'
import shapeScissors from './assets/scissors.png'
import shapePaper from './assets/paper.png'
import VideoCaptureComponent from './CaptureVideo';
import GameRules from './GameRules';
import Countdown from './Countdown';
import { CameraAccessState } from './Types';

type CaptureComponentProps = {
  userId: number
  team: number
  roundInfo: SSEContentEnable
}

const Capture: React.FunctionComponent<CaptureComponentProps> = (props) => {
  const [ state, send ] = useActor(useContext(StateMachineContext))
  const [ videoVisible, setVideoVisible ] = useState<boolean>(state.context.cameraAccess === CameraAccessState.Granted);
  const [ move, setMove ] = useState<Shape>();
  const [ request, setRequest ] = useState<Promise<Response>>()

  async function submitMove(imageData?: string) {
    if (imageData) {
      alert('Submit move!')
      setVideoVisible(false)
    } else if (move) {
      const _request = fetch(`/game/detect/button/${props.team}/${props.userId}/${move}`, {
        method: 'POST',
      })

      // Show a the waiting/loading screen while API is processing the request
      send({
        type: 'PAUSE',
        data: 'Processing'
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
  if (state.context.cameraAccess === CameraAccessState.Granted) {
    content = (
      <VideoCaptureComponent callback={(data) => submitMove(data)}/>
    )
  } else {
    content = (
      <div className='mt-12'>
        <div className="grid grid-cols-3 justify-center">
          <button className={`bg-slate-100 shape-selector ${move === Shape.Rock ? 'red' : ''}`} onClick={() => setMove(Shape.Rock)} >
            <img src={shapeRock} alt="rock" />
            <small>Rock</small>
          </button>
          <button className={`bg-slate-100 shape-selector ${move === Shape.Paper ? 'red' : ''}`} onClick={() => setMove(Shape.Paper)} >
            <img src={shapePaper} alt="paper" />
            <small>Paper</small>
          </button>
          <button className={`bg-slate-100 shape-selector ${move === Shape.Scissors ? 'red' : ''}`} onClick={() => setMove(Shape.Scissors)} >
            <img src={shapeScissors} alt="scissors" />
            <small>Scissors</small>
          </button>
        </div>
        <br />
        <button className={`rounded-md m-2 p-4 hover:bg-green-600 bg-green-500 ${move ? 'opacity-100' : 'opacity-50'}`} disabled={move === undefined} onClick={() => submitMove()}>
          <span>Submit Move &nbsp;</span>
          <IconContext.Provider value={{ className: 'text-white bg-transparent', style: { display: 'inline' } }}>
            <FiSend></FiSend>
          </IconContext.Provider>
        </button>
      </div>
    )
  }

  return (
    <div className='text-white grid mt-4 content-center'>
      {content}
      <hr className="border-gray-400 w-full max-w-2xl my-6" />
      <Countdown timeInSeconds={props.roundInfo.lengthOfRoundInSeconds}></Countdown>
      <GameRules />
    </div>
    
  );
}

export default Capture;
