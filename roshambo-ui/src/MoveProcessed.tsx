import { MoveProcessResponse, Shape } from "./Api";

type MovedProcessedComponentProps = {
  data: MoveProcessResponse
}

import iconRock from './assets/2023_Roshambo_UI__Rock_choice_icon.svg'
import iconPaper from './assets/2023_Roshambo_UI__Paper_choice_icon.svg'
import iconScissors from './assets/2023_Roshambo_UI__Scissor_choice_icon.svg'

const MoveProcessed: React.FunctionComponent<MovedProcessedComponentProps> = ({ data }) => {
  const shapes = {
    [Shape.Rock]: iconRock,
    [Shape.Paper]: iconPaper,
    [Shape.Scissors]: iconScissors
  }
  return (
    <div className="flex flex-col pt-12">
      <div className="flex flex-1 items-center mb-4">
        <p className="flex-1 text-2xl text-slate-200">Your move was...</p>
      </div>
      <div className="flex flex-1 items-center align-center text-center mb-4">
        <img className="inline m-auto h-20" src={shapes[data.shape]} alt={`${data.shape} icon`} />
      </div>
      <div className="flex flex-1 items-center">
        <h2 className="w-full text-4xl capitalize">{ data.shape.toLowerCase() }</h2>
      </div>
      <div className="flex flex-1 items-centerend mt-8">
        <p className="text-2xl w-full text-slate-200">The next round will begin soon...</p>
      </div>
    </div>
  );
}

export default MoveProcessed;
