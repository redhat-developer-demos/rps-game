import { useContext, useEffect, useRef, useState } from 'react'
import { SSEContentEnable, Shape, ShotResult } from './Api';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';

function isMobileDevice () {
  return navigator.userAgent.match(/ipod|ipad|iphone|android/gi)
}

type CaptureComponentProps = {
  userId: number
  team: number
  roundInfo: SSEContentEnable
}

const Capture: React.FunctionComponent<CaptureComponentProps> = (props) => {
  // TODO: maybe consider extracting video into it's own component
  const [ , send ] = useActor(useContext(StateMachineContext))
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [imageData, setImageData] = useState<string>()
  const [move, setMove] = useState<Shape>();
  const [ request, setRequest ] = useState<Promise<Response>>()
  const [ response, setResponse ] = useState<ShotResult>()

  useEffect(() => {
    getVideoStream()
  }, [videoRef])

  async function getVideoStream () {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 300,
        // On a laptop, use the camera that faces the user. On iOS and Android
        // devices use the "selfie" camera
        facingMode: isMobileDevice() ? 'environment' : 'user'
      }
    })
    
    const video = videoRef.current;
    
    if (video) {
      video.srcObject = stream;
      video.play();
    }
  }

  function captureMove () {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && video && ctx) {
      const width = 320;
      const height = 240;
      
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(video, 0, 0, width, height);

      setImageData(canvas.toDataURL())
    }
  }

  function discardMove () {
    setImageData(undefined)
  }

  async function submitMove() {
    if (imageData) {
      // Submit image data
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

  return (
    <div>
      <div hidden={response === undefined }>
        The classifier determined that your move was {response?.shape}!
      </div>
      <div hidden={request !== undefined}>
        <button hidden={imageData ? true : false} onClick={() => captureMove()}>Capture Move</button>
        <button hidden={imageData ? false : true} onClick={() => discardMove()}>Discard Move</button>
        <br />
        <br />
        <video hidden={imageData ? true : false} ref={videoRef} autoPlay playsInline muted />
        <canvas hidden={imageData ? false : true} ref={canvasRef}></canvas>
        <br />
        <br />
        <button onClick={() => setMove(Shape.Rock)} >🪨</button>
        <button onClick={() => setMove(Shape.Paper)} >🧻</button>
        <button onClick={() => setMove(Shape.Scissors)} >✂️</button>
        <br />
        <br />
        <button hidden={move === undefined} onClick={submitMove}>Submit Move</button>
        {move && <h2>You have selected {move}</h2>}
      </div>
    </div>
  );
}

export default Capture;
