import './App.css'
import { useActor } from '@xstate/react'
import { useContext } from 'react'
import Footer from './Footer'
import Header from './Header'
import { StateMachineContext } from './StateMachineProvider'
import log from 'barelog'
import ContentReady from './ContentReady'
import ContentPlay from './ContentPlay'
import ContentGameOver from './ContentGameOver'
import TeamInfoPane from './TeamInfoPane'

function App() {
  const [ state ] = useActor(useContext(StateMachineContext))

  log(`current state is "${state.value}" and context:`, state.context)

  let main: JSX.Element
  
  if (state.value === 'READY' || state.value === 'STOPPED') {
    main = <ContentReady />
  } else if (state.value === 'PLAY') {
    main = <ContentPlay />
  } else if (state.value === 'GAME_OVER') {
    main = <ContentGameOver />
  } else {
    main = (
      <h2>Please Wait...</h2>
    )
  }

  return (
    <div className='min-h-screen min-w-screen'>
      <Header></Header>
      <main className="flex-grow px-8 h-screen">
        <div className="grid grid-rows-6 mx-auto h-full">
          <div className='row-span-1'></div>

          <div className="flex gap-5 row-span-4">
            <TeamInfoPane team={'TEAM_1'} />
            <div className="w-1/2 flex items-center text-center">
              {main}
            </div>
            <TeamInfoPane team={'TEAM_2'} />
          </div>

          <div className='row-span-1'></div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  )
}

export default App
