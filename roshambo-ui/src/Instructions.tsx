import React, { useContext } from 'react';
import { IconContext } from 'react-icons'
import { FiCheckCircle, FiAlertCircle, FiPlay } from 'react-icons/fi';
import { CameraAccessState } from './Types';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import { useNavigate } from 'react-router-dom';
import IconRow from './IconRow';
import Waiting from './Waiting';

const CameraAccessColourMap = {
  [CameraAccessState.Unknown]: 'amber',
  [CameraAccessState.Pending]: 'slate',
  [CameraAccessState.Granted]: 'green',
  [CameraAccessState.Denied]: 'red'
}

const CameraAccessTextMap = {
  [CameraAccessState.Unknown]: 'Grant Camera Access',
  [CameraAccessState.Pending]: 'Camera Access Pending',
  [CameraAccessState.Granted]: 'Camera Access Granted',
  [CameraAccessState.Denied]: 'Grant Camera Access'
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
    <div className="flex place-content-center items-center py-8 px-4">
      <div className="flex h-full flex-col justify-center space-y-6">
        <h1 className="text-3xl font-bold tracking-wide">Rock, Paper, Scissors</h1>
        <p className="text-lg">
          An interactive game powered by{' '}
          <a
            href="https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-data-science"
            target="_blank"
            rel="noreferrer"
            className="underline text-red-600"
          >
            Red Hat OpenShift Data Science
          </a>
        </p>

        <hr className="border-gray-400 w-full max-w-2xl my-6" />

        <div className="text-white">
          <p className="text-2xl font-semibold mb-4">Instructions</p>
          <p className='mb-4'>
            Once the game starts you'll be prompted to select a shape; rock, paper, or scissors.
          </p>
          <div className="my-5">
            <IconRow animated={false} />
          </div>
          <div className="camera-access" hidden={cameraFeatureEnabled === false}>
            <p hidden={cameraFeatureEnabled === false}>
              You can use your camera to take a picture of your hand in the shape of rock, paper, or scissors if you <strong>Grant Camera Access</strong>!
            </p>
            <button disabled={cameraAccessStatus === CameraAccessState.Granted || cameraAccessStatus === CameraAccessState.Pending} className={`rounded-md p-4 hover:bg-${colour}-600 bg-${colour}-500 my-6 w-10/12`} onClick={() => requestCameraAccess()}>
              <span>{buttonText} &nbsp;</span>
              <IconContext.Provider value={{ className: 'rounded-none text-white bg-transparent round pb-1', style: { height: 28, display: 'inline' } }}>
                {cameraAccessStatus === CameraAccessState.Granted ? <FiCheckCircle/> : <FiAlertCircle/>}
              </IconContext.Provider>
            </button>
          </div>
          <p>
            Your team's most popular move selection will be used against the other team!
          </p>
          <button className={'w-10/12 rounded-md p-4 hover:bg-green-600 bg-green-500 my-5'} onClick={joinGame}>
            <span>Join Game &nbsp;</span>
            <IconContext.Provider value={{ className: 'rounded-none text-white bg-transparent round pb-1', style: { height: 28, display: 'inline' } }}>
              <FiPlay/>
            </IconContext.Provider>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
