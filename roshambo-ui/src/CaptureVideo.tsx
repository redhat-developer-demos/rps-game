import './CaptureVideo.css'
import { useEffect, useRef, useState } from "react";

type VideoCaptureComponentProps = {
  callback: (data: string) => void
}

function isMobileDevice () {
  return navigator.userAgent.match(/ipod|ipad|iphone|android/gi)
}

const VideoCaptureComponent: React.FunctionComponent<VideoCaptureComponentProps> = ({ callback }) => {
  const [ imageData, setImageData ] = useState<string>()
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [ stream, setStream ] = useState<MediaStream>()
  
  useEffect(() => {
    if (!stream) {
      getVideoStream()
    }

    return function cleanUpVideoCapture () {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [videoRef, stream])

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

    setStream(stream)
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

  function submitMove () {
    if (imageData) {
      callback(imageData)
    } else {
      alert('Cannot submit move. No image data is defined')
    }
  }

  return (
    <div className="justify-center">
      <p hidden={imageData ? true : false} className='py-4'>Capture your move using the camera!</p>
      <p hidden={imageData ? false : true} className='py-4'>Ready to submit this move?</p>
      <video className="rounded m-auto w-full" hidden={imageData ? true : false} ref={videoRef} autoPlay playsInline muted />
      <canvas className="rounded m-auto w-full" hidden={imageData ? false : true} ref={canvasRef}></canvas>
      <button className='rounded bg-red-600 border-solid border-2 border-red-500 px-8 py-3 m-4' hidden={imageData ? true : false} onClick={() => captureMove()}>Capture Move</button>
      <div className="flex justify-center pt-2">
        <button className='rounded bg-orange-600 border-solid border-2 border-orange-500 px-8 py-3 m-4' hidden={imageData ? false : true} onClick={() => discardMove()}>Discard</button>
        <button className='rounded bg-green-600 border-solid border-2 border-green-500 px-8 py-3 m-4' hidden={imageData ? false : true} onClick={() => submitMove()}>Submit</button>
      </div>
    </div>
  );
}

export default VideoCaptureComponent;
