import './CaptureVideo.css'
import { useCallback, useEffect, useRef, useState } from "react";

type VideoCaptureComponentProps = {
  callback: (data: string) => void
}

function isMobileDevice () {
  return navigator.userAgent.match(/ipod|ipad|iphone|android/gi)
}

const VideoCaptureComponent: React.FunctionComponent<VideoCaptureComponentProps> = ({ callback }) => {
  const [ imageData, setImageData ] = useState<string>()
  const videoRef = useRef<HTMLVideoElement|null>(null);
  // const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [ stream, setStream ] = useState<MediaStream>()

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(undefined)
    }
  }, [stream])
  
  useEffect(() => {
    if (imageData) {
      stopStream()
      return
    }

    if (!stream) {
      getVideoStream()
    }

    return stopStream
  }, [stream, imageData, stopStream])

  async function getVideoStream () {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        // aspectRatio: 4 / 3,
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
    const canvas = document.createElement('canvas')
    const ctx = canvas?.getContext('2d');

    if (canvas && video && ctx) {
      const { clientHeight: height, clientWidth: width } = video
      
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
    console.log('submit move. has data', imageData ? true:false)
    console.log(typeof callback, callback.toString())
    if (imageData) {
      callback(imageData)
    } else {
      alert('Cannot submit move. No image data is defined')
    }
  }

  if (!imageData) {
    return (
      <div className="justify-center">
        <p className='py-4'>Capture your move using the camera!</p>
        <div className="video-container">
          <video className={`block rounded m-auto ${isMobileDevice() ? '' : 'flipped'}`} ref={videoRef} autoPlay playsInline muted />
        </div>
        <div className={`flex justify-center pt-2`}>
          <button className='rounded bg-red-600 border-solid border-2 border-red-500 px-8 py-3 m-4' onClick={() => captureMove()}>Capture Move</button>
        </div>
      </div>
    )
  } else {
    return (
      <div className="justify-center">
        <p className='py-4'>Ready to submit this move?</p>
        <div className="video-container">
          <img className={`block rounded m-auto ${isMobileDevice() ? '' : 'flipped'}`} src={imageData} />
        </div>
        <div className={`flex justify-center pt-2`}>
          <button className='rounded bg-orange-600 border-solid border-2 border-orange-500 px-8 py-3 m-4' onClick={() => discardMove()}>Discard</button>
          <button className='rounded bg-green-600 border-solid border-2 border-green-500 px-8 py-3 m-4' onClick={() => submitMove()}>Submit</button>
        </div>
      </div>
    )
  }
}

export default VideoCaptureComponent;
