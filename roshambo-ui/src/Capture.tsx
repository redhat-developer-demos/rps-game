import styles from './Capture.module.css'
import { useContext, useState } from 'react'
import { SSEContentEnable, Shape } from './Api';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';

import shapeRock from './assets/2023_Roshambo_UI__Rock_choice_icon.svg'
import shapePaper from './assets/2023_Roshambo_UI__Paper_choice_icon.svg'
import shapeScissors from './assets/2023_Roshambo_UI__Scissor_choice_icon.svg'
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
          'content-type': 'text/plain'
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
        <h2 className='text-2xl'>Choose your move!</h2>
        <div className="grid grid-cols-3 gap-3 justify-center mb-8">
          <button className={`${styles.button} ${move === Shape.Rock ? styles.selected : ''}`} onClick={() => setMove(Shape.Rock)} >
            <img className='' src={shapeRock} alt="rock" />
            <p>Rock</p>
          </button>
          <button className={`${styles.button} ${move === Shape.Paper ? styles.selected : ''}`} onClick={() => setMove(Shape.Paper)} >
            <img src={shapePaper} alt="paper" />
            <p>Paper</p>
          </button>
          <button className={`${styles.button} ${move === Shape.Scissors ? styles.selected : ''}`} onClick={() => setMove(Shape.Scissors)} >
            <img src={shapeScissors} alt="scissors" />
            <p>Scissors</p>
          </button>
        </div>
        <br />
        <button className={`bg-blue text-2xl py-3 px-14 rounded font-semibold ${move ? 'opacity-100' : 'opacity-50'}`} disabled={move === undefined} onClick={() => submitMove()}>
          <span>Submit move &nbsp;</span>
        </button>
      </div>
    )
  }

  return (
    <div className='text-white h-full grid content-center capture-container'>
      {content}
      <Countdown timeInSeconds={30}></Countdown>
    </div>
    
  );
}

export default Capture;
