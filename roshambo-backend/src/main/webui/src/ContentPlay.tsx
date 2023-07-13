import { useActor } from '@xstate/react'
import React, { useContext } from 'react'
import { StateMachineContext } from './StateMachineProvider'
import { Shape } from './Api'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const ContentPlay: React.FunctionComponent = () => {
  const [ state ] = useActor(useContext(StateMachineContext))
  
  const shapeCounts = state.context.userActions?.reduce((acc, shape) => {
    acc[shape.shape] += 1

    return acc
  }, {
    'ROCK': 0,
    'PAPER': 0,
    'SCISSORS': 0
  } as Record<Shape, number>)

  const shapeEls = Object.keys(shapeCounts).map((k) => {
    return (
      <div key={`${k}`} className='w-full pt-6 text-gray-500 font-bold flex flex-row items-center justify-center'>
        <p className='w-6'></p>
        <p className='flex-1 text-2xl text-right'>{k}</p>
        <p className='w-6'></p>
        <p className='flex-1 text-2xl text-left'>x{shapeCounts[k as Shape]}</p>
        <p className='w-6'></p>
      </div>
    )
  })

  return (
    <div className="w-full flex-col">
      <h2 className="text-3xl pt-6 pb-12 text-center font-semibold italic">Make your move!</h2>
      
      <div className='w-full items-center'>
        <div className="flex flex-row flex-wrap">
          {shapeEls}
        </div>
      </div>
      
      <div className="text-center flex pt-12">
        <div className="mx-auto my-0">
          <CountdownCircleTimer
            isPlaying
            duration={state.context.config.roundTimeInSeconds}
            colors='#EE1111'
            trailColor='rgba(0,0,0,0)'
            strokeWidth={10}
            size={96}
          >
            {
              ({ remainingTime }) => {
                return <div className='font-bold text-slate-950 text-xl'>{remainingTime}</div>
              }
            }
          </CountdownCircleTimer>
        </div>
      </div>
    </div>
  )
}

export default ContentPlay