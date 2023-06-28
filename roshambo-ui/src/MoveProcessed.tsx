import { MoveProcessResponse, Shape } from "./Api";

type MovedProcessedComponentProps = {
  data: MoveProcessResponse
}

import shapeRockUrl from './assets/rock.png'
import shapeScissorsUrl from './assets/scissors.png'
import shapePaperUrl from './assets/paper.png'

const MoveProcessed: React.FunctionComponent<MovedProcessedComponentProps> = ({ data }) => {
  const shapes = {
    [Shape.Rock]: shapeRockUrl,
    [Shape.Paper]: shapePaperUrl,
    [Shape.Scissors]: shapeScissorsUrl
  }
  return (
    <div className="h-full flex flex-col py-12">
      <div className="flex flex-1 items-center">
        <p className="flex-1 text-xl text-slate-200">Our model determined that your move was:</p>
      </div>
      <div className="flex flex-1 items-center align-center text-center">
        <img className="inline m-auto invert h-24" src={shapes[data.shape]} alt={`${data.shape} icon`} />
      </div>
      <div className="flex flex-1 items-center">
        <h2 className="w-full text-4xl capitalize">{ data.shape.toLowerCase() }</h2>
      </div>
      <div className="flex flex-1 items-centerend">
        <p className="text-xl w-full text-slate-200">The next round will begin soon...</p>
      </div>
    </div>
  );
}

export default MoveProcessed;
