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
import Countdown from './Countdown';
import { CameraAccessState } from './Types';

type CaptureComponentProps = {
  userId: number
  team: number
  roundInfo: SSEContentEnable
}

const Capture: React.FunctionComponent<CaptureComponentProps> = (props) => {
  const [ state, send ] = useActor(useContext(StateMachineContext))
  const [ , setVideoVisible ] = useState<boolean>(state.context.cameraAccess === CameraAccessState.Granted);
  const [ move, setMove ] = useState<Shape>();

  async function submitMove(imageData?: string) {
    let _request!: Promise<Response>

    send({
      type: 'PAUSE',
      data: 'Processing'
    })

    if (imageData) {
      setVideoVisible(false)

      _request = fetch(`/game/detect/shot/${props.team}/${props.userId}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/octet-stream'
        },
        body: imageData
      })


    } else {
      _request = fetch(`/game/detect/button/${props.team}/${props.userId}/${move}`, {
        method: 'POST',
      })
    }

    try {
      const response = await _request

      if (response.status !== 200) {
        throw new Error(`Received ${response.status} from server`)
      } else {
        const data = await response.json()
        send({ type: 'MOVE_PROCESSED', data })
      }
    } catch (e: any) {
      alert(`Error processing move: ${e.toString()}`)
      console.error('error processing move', e)
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
    <div className='text-white h-full grid content-center'>
      {content}
      <Countdown timeInSeconds={30}></Countdown>
    </div>
    
  );
}

export default Capture;
