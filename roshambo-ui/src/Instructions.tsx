import React, { useContext } from 'react';
import GameRules from './GameRules';
import { IconContext } from 'react-icons'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { CameraAccessState } from './Types';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';

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
  const [ state, send ] = useActor(useContext(StateMachineContext))
  const cameraAccessStatus = state.context.cameraAccess ?? CameraAccessState.Unknown

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
    <div className="h-screen items-center justify-center py-4 px-4">
      <div className="flex flex-col justify-start space-y-6">
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
          <p className="text-2xl font-semibold mb-4">Instructions:</p>
          <p className="mb-4 text-lg">
            Use your camera or select a shape to make your move. The TensorFlow ML model will process the image, and your team's most popular move will be selected against the other team!
          </p>
          <button disabled={cameraAccessStatus === CameraAccessState.Granted || cameraAccessStatus === CameraAccessState.Pending} className={`rounded-md m-2 p-4 hover:bg-${colour}-600 bg-${colour}-500`} onClick={() => requestCameraAccess()}>
            <span>{buttonText} &nbsp;</span>
            <IconContext.Provider value={{ className: 'rounded-none text-white bg-transparent round pb-1', style: { height: 28, display: 'inline' } }}>
              {cameraAccessStatus === CameraAccessState.Granted ? <FiCheckCircle/> : <FiAlertCircle/>}
            </IconContext.Provider>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="progress-wheel"></div>
          <p className="text-1xl font-bold">Get ready... The game will begin soon!</p>
        </div>

        <hr className="border-gray-400 w-full max-w-2xl my-6" />

        <GameRules />
      </div>
    </div>
  );
};

export default InstructionsPage;
