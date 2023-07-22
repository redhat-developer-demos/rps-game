import { useActor } from '@xstate/react'
import React, { useContext } from 'react'
import { StateMachineContext } from './StateMachineProvider'
import { Shape } from './Api'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import IconRock from './assets/2023_Roshambo_UI__Move_Counter_rock_Icon.svg'
import IconPaper from './assets/2023_Roshambo_UI__Move_Counter_paper_Icon.svg'
import IconScissors from './assets/2023_Roshambo_UI__Move_Counter_Scissorsv_Icon.svg'

const ShapeIconMap: Record<Shape, string> = {
  ROCK: IconRock,
  PAPER: IconPaper,
  SCISSORS: IconScissors
}

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
      <div key={`${k}`} className='w-1/2 py-2 px-4 my-2 text-black font-medium flex flex-row items-center justify-center rounded border-2'>
        <div className='flex-1 text-left'>
          <img className="h-8" src={ShapeIconMap[k as Shape]} alt={`${k} icon`} />
        </div>
        {/* <p className='flex-1 text-2xl text-left'>{SHAPE}</p> */}
        <p className='flex-1 text-2xl text-center capitalize'>{k.toLowerCase()}</p>
        <p className='flex-1 text-2xl text-right'>x{shapeCounts[k as Shape]}</p>
      </div>
    )
  })

  return (
    <div className="w-full flex-col">
      <h2 className="text-2xl pt-2 pb-2 text-center font-semibold">Make your move!</h2>
      <p className='text-slate-500 pb-10'>These counters show how many people have selected each shape.<br/>Choose wisely!</p>
      <div className='w-full items-center m-auto'>
        <div className="flex flex-col items-center flex-wrap">
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