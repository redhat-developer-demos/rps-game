type InstructionsComponentProps = {
  username: string
}

const InstructionsPage: React.FunctionComponent<InstructionsComponentProps> = ({ username }) => {

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6 px-4 min-h-screen">
      <div className="flex flex-col items-center space-y-4 py-6">
        <h1 className="text-5xl font-bold tracking-wide">Rock, Paper, Scissors</h1>
        {/* <h2 className="text-4xl font-bold tracking-wide">Welcome, {username}!</h2> */}
        <p className="text-lg">Powered by <a href="https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-data-science" target="_blank" rel="noreferrer" className="underline text-red-600">Red Hat OpenShift Data Science</a></p>
      </div>
      <hr className="border-gray-400 w-full max-w-lg my-6"/>
      <div className="w-full grid grid-cols-1 gap-4 bg-white bg-opacity-25 p-4">
      <p className="text-lg font-semibold">Game Rules:</p>
        <div className="flex items-center justify-center space-x-2 p-3 rounded-lg shadow-lg text-gray-700 text-lg font-semibold max-w-lg mx-auto">
          <span className="text-5xl">🗿</span>
          <p>Rock crushes Scissors</p>
        </div>
        <div className="flex items-center justify-center space-x-2 p-3 rounded-lg shadow-lg text-gray-700 text-lg font-semibold max-w-lg mx-auto">
          <span className="text-5xl">📜</span>
          <p>Paper covers Rock</p>
        </div>
        <div className="flex items-center justify-center space-x-2 p-3 rounded-lg shadow-lg text-gray-700 text-lg font-semibold max-w-lg mx-auto">
          <span className="text-5xl">✂️</span>
          <p>Scissors cut Paper</p>
        </div>
      </div>
      <hr className="border-gray-400 w-full max-w-lg my-6"/>
      <div className="w-full p-4 rounded-lg bg-white bg-opacity-25 text-gray-800">
        <p className="text-lg font-semibold">Let's get started!</p>
        <p>Make your move with your camera or simply select an emoji.</p>
        <p className="text-lg font-semibold mt-4">Here's what each emoji means:</p>
        <div className="flex justify-center items-center space-x-2 mt-2">
          <span className="text-4xl">🗿</span>
          <span>=</span>
          <span>Fist</span>
        </div>
        <div className="flex justify-center items-center space-x-2 mt-2">
          <span className="text-4xl">📜</span>
          <span>=</span>
          <span>Open hand</span>
        </div>
        <div className="flex justify-center items-center space-x-2 mt-2">
          <span className="text-4xl">✂️</span>
          <span>=</span>
          <span>Peace sign</span>
        </div>
      </div>
      <p className="text-lg font-bold">Get ready... The game will begin soon!</p>
    </div>
  );
}

export default InstructionsPage;
