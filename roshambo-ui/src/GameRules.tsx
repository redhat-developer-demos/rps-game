import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import explainerImg from './assets/explainer.png';

const GameRules: React.FC<{ open?: boolean }> = ({ open }) => {
  const [show, setShow] = useState(open ?? false);

  const handleShowRules = () => {
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <button
          className="bg-red hover:bg-red text-white font-bold py-3 px-8 border-red-400 border-2 rounded"
          onClick={handleShowRules}
        >
          Show Game Rules
        </button>
      </div>

      {show && ReactDOM.createPortal(
        <div className="fixed inset-0 text-black bg-gray-900 bg-opacity-75 flex justify-center items-center" onClick={handleCloseModal}>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex flex-col items-center justify-center space-y-6 bg-white bg-opacity-25 p-8 rounded-lg">
              <p className="text-3xl font-bold">Game Rules</p>
              <img src={explainerImg} className="w-64 mx-auto" alt="Game rules illustration" />
              <div className="flex flex-col items-center space-y-2">
                <p className="text-xl">Rock beats scissors.</p>
                <p className="text-xl">Scissors beats paper.</p>
                <p className="text-xl">Paper beats rock.</p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-red hover:bg-red text-white font-bold py-3 px-8 rounded" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default GameRules;
