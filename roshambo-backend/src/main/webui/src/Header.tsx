import { useActor } from "@xstate/react"
import { useContext, useState } from "react"
import { StateMachineContext } from "./StateMachineProvider"
import { startGame, advanceRound } from "./Api"
import MusicRecommendationBtn from "./MusicRecommendation"

function Header () {
  return (
    <header className="py-4 fixed top-0 w-screen">
      <div className="mx-auto px-8 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold italic">Roshambo Mission Control</h1>
        <a target="_blank" className="font-semibold cursor-pointer transition-colors duration-300 text-blue-600 hover:text-blue-400" href="https://open.spotify.com/track/3bpfZHC60n4K3l5qSGssvm?si=522d97e7cc4142f6">Battle Music 🎶</a>
      </div>
      <hr />
    </header>
  )
}

export default Header