import React from 'react';
import explainerImg from './assets/explainer.png';

const GameRules: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-6 bg-white bg-opacity-25 p-8 rounded-lg">
    <p className="text-3xl font-bold">Game Rules</p>
    <img src={explainerImg} className="w-64 mx-auto" alt="" />
    <div className="flex flex-col items-center space-y-2">
      <p className="text-xl">Rock beats scissors.</p>
      <p className="text-xl">Scissors beats paper.</p>
      <p className="text-xl">Paper beats rock.</p>
    </div>
  </div>
);

export default GameRules;
