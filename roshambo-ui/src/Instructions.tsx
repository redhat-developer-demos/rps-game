import React, { useContext } from 'react';
import { IconContext } from 'react-icons'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { CameraAccessState } from './Types';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import { useNavigate } from 'react-router-dom';
import IconRow from './IconRow';
import Waiting from './Waiting';
import RoshamboLogo from './assets/2023_Roshambo_UI__Roshambo_Logo_Descrip_W.svg'
import './Instructions.css'

const CameraAccessColourMap = {
  [CameraAccessState.Unknown]: 'yellow',
  [CameraAccessState.Pending]: 'yellow',
  [CameraAccessState.Granted]: 'green',
  [CameraAccessState.Denied]: 'red'
}

const CameraAccessTextMap = {
  [CameraAccessState.Unknown]: 'Grant Camera Access',
  [CameraAccessState.Pending]: 'Camera Access Pending',
  [CameraAccessState.Granted]: 'Camera Access Granted',
  [CameraAccessState.Denied]: 'Camera Unavailable'
}

const InstructionsPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [ state, send ] = useActor(useContext(StateMachineContext))

  if (!state.context.config) {
    return (
      <div className='h-screen -mt-12 grid grid-rows-6 grid-flow-row p-4 text-white container' id="app-container">
        <div className='row-span-1'></div>
        <div className='row-span-5 -mt-4'>
          <Waiting message={'Loading...'}></Waiting>
        </div>
      </div>
    )
  }

  const cameraAccessStatus = state.context.cameraAccess ?? CameraAccessState.Unknown
  const cameraFeatureEnabled = state.context.config.enableCamera

  function joinGame () {
    if (cameraAccessStatus !== CameraAccessState.Granted && cameraFeatureEnabled) {
      const proceed = confirm(`Are you sure you'd like to join the game without granting camera access?`)

      if (proceed) {
        navigate('/play')
      }
    } else {
      navigate('/play')
    }
  }

  async function requestCameraAccess () {
    send({
      type: 'CAMERA_ACCESS',
      state: CameraAccessState.Pending
    })

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {}
      })

      stream.getTracks().forEach(t => t.stop())

      send({
        type: 'CAMERA_ACCESS',
        state: CameraAccessState.Granted
      })
    } catch (e) {
      send({
        type: 'CAMERA_ACCESS',
        state: CameraAccessState.Denied
      })
    }
  }

  const colour = CameraAccessColourMap[cameraAccessStatus]
  const buttonText = CameraAccessTextMap[cameraAccessStatus]
  return (
    <div className="m-auto flex place-content-center items-center py-8 px-7">
      <div className="flex h-full flex-col justify-center space-y-6">
        <img src={RoshamboLogo} alt="Roshambo Game Logo" />
        {/* <p className="text-lg">
          An interactive game powered by{' '}
          <a
            href="https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-data-science"
            target="_blank"
            rel="noreferrer"
            className="underline text-red-600"
          >
            Red Hat OpenShift Data Science
          </a>
        </p> */}

        <hr className="border-gray-400 w-full max-w-2xl my-6" />

        <div className="text-white">
          <p className="text-xl font-bold mb-4">Game Instructions</p>
          {/* <p className='mb-4'>
            Once the game starts you'll be prompted to select a shape; rock, paper, or scissors.
          </p> */}

          <div className="camera-access" hidden={cameraFeatureEnabled === false}>
            <p className="font-bold mb-1">Step 1</p>
            
            <p>Before starting, make sure to <strong>Grant Camera Access</strong> using the button below.</p>

            <button disabled={cameraAccessStatus === CameraAccessState.Granted || cameraAccessStatus === CameraAccessState.Pending} className={`text-xl font-semibold text-black rounded-md p-4 bg-${colour} my-6 w-full`} onClick={() => requestCameraAccess()}>
              <span>{buttonText} &nbsp;</span>
              <IconContext.Provider value={{ className: 'rounded-none bg-transparent round pb-1', style: { height: 28, display: 'inline' } }}>
                {cameraAccessStatus === CameraAccessState.Granted ? <FiCheckCircle/> : <FiAlertCircle/>}
              </IconContext.Provider>
            </button>

            <p className="font-bold mb-1">Step 2</p>
            <p className='mb-4'>Use your camera to take a picture of your hand in the shape of rock, paper, or scissors.</p>
            <IconRow animated={false} />
          </div>

          <p className="font-bold mb-1 mt-4">Step 3</p>
          <p>Your team's most popular move selection will be used against the other team!</p>
          <button className={'w-full text-xl font-semibold text-black rounded-md p-4 bg-green my-5'} onClick={joinGame}>
            <span>Join Game &nbsp;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
