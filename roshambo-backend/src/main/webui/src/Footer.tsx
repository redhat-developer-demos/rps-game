import { useActor } from "@xstate/react";
import { useContext } from "react";
import Marquee from "react-fast-marquee";
import { StateMachineContext } from "./StateMachineProvider";

const Footer: React.FunctionComponent = () => {
  const [ state ] = useActor(useContext(StateMachineContext))
  const { roundResults } = state.context
  
  let topPlayers = [<span>&nbsp;&nbsp;&nbsp;Pending&nbsp;&nbsp;&nbsp;</span>]

  if (roundResults && roundResults.length !== 0) {
    topPlayers = roundResults[roundResults.length - 1].topPlayers.reduce((els, player, idx, items) => {
      els.push(<span key={player}>&nbsp;&nbsp;&nbsp; #{idx + 1} {player} &nbsp;&nbsp;&nbsp;{idx === items.length - 1 ? '' : '|'}</span>)

      return els
    }, [] as JSX.Element[])
  }

  return (
    <footer className="py-4 bg-grey fixed bottom-0 w-screen text-white">
      <Marquee speed={50} className="text-xl">
        <span className="font-bold">Top Players &nbsp;&nbsp;-</span>
        {topPlayers}
        <span className="font-bold">-&nbsp;&nbsp; Top Players</span>
      </Marquee>
    </footer>
  )
}

export default Footer