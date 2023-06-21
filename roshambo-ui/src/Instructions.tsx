import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import GameRules from './GameRules';

type InstructionsComponentProps = {
  username: string
}

const InstructionsPage: React.FunctionComponent<InstructionsComponentProps> = ({ username }) => {
  const [showRules, setShowRules] = useState(false);

  const closeModal = () => {
    setShowRules(false);
  };

  return (
    <div className="h-screen items-center justify-center py-4 px-4">
      <div className="flex flex-col justify-start space-y-6">
        <h1 className="text-6xl font-bold tracking-wide">Rock, Paper, Scissors</h1>
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
          <p className="mb-7">
            Use your camera or select an emoji to make your move. The TensorFlow ML model will process the image, and the team's most popular move will be selected against the other team!
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="progress-wheel"></div>
          <p className="text-1xl font-bold">Get ready... The game will begin soon!</p>
        </div>

        <hr className="border-gray-400 w-full max-w-2xl my-6" />

        {showRules && ReactDOM.createPortal(
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center" onClick={closeModal}>
            <div className="bg-white p-4 rounded-lg">
              <GameRules />
              <div className="flex justify-center mt-4">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded" onClick={closeModal}>
                  Back
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      <div className="fixed" style={{width: '60vw', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <div className="flex justify-center">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded"
            onClick={() => setShowRules(true)}
          >
            Show Game Rules
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructionsPage;
