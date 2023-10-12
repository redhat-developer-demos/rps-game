import './CaptureVideo.css'
import log from 'barelog'
import { useCallback, useEffect, useRef, useState } from "react";

type VideoCaptureComponentProps = {
  callback: (data: string) => void
}

function isMobileDevice () {
  return navigator.userAgent.match(/ipod|ipad|iphone|android/gi)
}

/**
 * This component renders a video feed captured from the user's camera on screen
 * using the <video> element in combination with the getUserMedia API. It also
 * displays a button that can be used to capture the current frame. In other
 * words this UI mimics a camera.
 * 
 * The captured image is written to a <canvas> element that is then shown in
 * place of the video feed so the user can confirm it looks goof before sending
 * it to the backend.
 */

const VideoCaptureComponent: React.FunctionComponent<VideoCaptureComponentProps> = ({ callback }) => {
  const [ imageData, setImageData ] = useState<string>()
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [ stream, setStream ] = useState<MediaStream>()

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(undefined)
    }
  }, [stream])

  const getVideoStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        // Forces landscape image, despite the application's portrait orientation
        aspectRatio: 3 / 4,
        // On a laptop, use the camera that faces the user. On iOS and Android
        // devices use the "selfie" camera
        facingMode: isMobileDevice() ? 'environment' : 'user'
      }
    })
    
    const video = videoRef.current;
    
    try {
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setStream(stream)
    } catch (e) {
      // Sometimes video.play throws an exception and then plays but with
      // an incorrect aspect ratio. This forces a retry.
      stream.getTracks().forEach(t => t.stop())
      setTimeout(() => getVideoStream(), 100)
    }
  }, [])

  useEffect(() => {
    if (imageData) {
      stopStream()
      return
    }

    if (!stream) {
      getVideoStream()
    }

    return stopStream
  }, [stream, imageData, stopStream, getVideoStream])

  function captureMove () {
    const video = videoRef.current;
    const canvas = document.createElement('canvas')
    const ctx = canvas?.getContext('2d');

    if (canvas && video && ctx) {
      const {
        // Could use client width and height, but
        // these are typically lower resolution
        videoHeight: vHeight, videoWidth: vWidth
      } = video

      canvas.width = vWidth;
      canvas.height = vHeight;

      log(`drawing image to canvas. size is ${vWidth}x${vHeight}`)
      ctx.drawImage(video, 0, 0, vWidth, vHeight);


      setImageData(canvas.toDataURL("image/jpeg", 0.7))
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

  if (!imageData) {
    return (
      <div className="justify-center">
        <p className='py-4'>Capture your move using the camera!</p>
        <div className="video-container">
          <video className={`block rounded m-auto ${isMobileDevice() ? '' : 'flipped'}`} ref={videoRef} autoPlay playsInline muted />
        </div>
        <div className={`flex justify-center pt-2`}>
          <button className={'w-8/12 text-xl font-semibold text-grey rounded-md p-4 bg-green my-5'} onClick={captureMove}>
            <span>Capture Move</span>
          </button>
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
          <button className='text-xl font-semibold rounded-md bg-red px-8 py-3 m-4' onClick={() => discardMove()}>Discard</button>
          <button className='text-xl font-semibold text-grey rounded-md bg-green px-8 py-3 m-4' onClick={() => submitMove()}>Submit</button>
        </div>
      </div>
    )
  }
}

export default VideoCaptureComponent;
