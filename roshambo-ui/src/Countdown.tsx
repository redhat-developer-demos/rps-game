import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import './Countdown.css'
type CountdownComponentProps = {
  timeInSeconds: number
};

const Countdown: React.FunctionComponent<CountdownComponentProps> = ({ timeInSeconds }) => {
  // https://stackoverflow.com/questions/69481222/simple-countdown-circle-animation-with-pure-css
  return (
    <div className="fixed bottom-6 bg-color-white">
      <CountdownCircleTimer
        isPlaying
        duration={timeInSeconds}
        colors='#EE1111'
        trailColor='rgba(0,0,0,0)'
        strokeWidth={8}
        size={64}
      >
        {
          ({ remainingTime }) => {
            return <div className='font-bold text-slate-950'>{remainingTime}</div>
          }
        }
      </CountdownCircleTimer>
    </div>
  );
};

export default Countdown;
