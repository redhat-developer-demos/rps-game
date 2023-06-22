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
    <div className="mt-12">
      <p className="text-xl text-slate-200">Our model determined that your move was:</p>
      <br />
      <div className="text-center mb-4">
        <img className="inline invert h-24" src={shapes[data.shape]} alt={`${data.shape} icon`} />
      </div>
      <h2 className="text-4xl capitalize">{ data.shape.toLowerCase() }</h2>
      <br />
      <p className="text-xl text-slate-200">The next round will begin soon...</p>
    </div>
  );
}

export default MoveProcessed;
