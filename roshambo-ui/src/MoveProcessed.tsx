import { MoveProcessResponse } from "./Api";


type MovedProcessedComponentProps = {
  data: MoveProcessResponse
}

const MoveProcessed: React.FunctionComponent<MovedProcessedComponentProps> = ({ data }) => {
  return (
    <>
      <p className="text-xl text-slate-500">Our model determined that your move was:</p>
      <br />
      <h2 className="text-4xl">{ data.shape }</h2>
      <br />
      <p className="text-sm text-slate-500">The next round will begin soon...</p>
    </>
  );
}

export default MoveProcessed;
