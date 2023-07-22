import RoshamboLogo from './assets/2023_Roshambo_UI__Roshambo_Logo_only.svg'

function Header () {
  return (
    <header className="py-4 fixed top-0 w-screen bg-black">
      <div className="mx-auto px-8 flex justify-between items-center">
        <div className='flex flex-1'>
          <img className='flex h-12' src={RoshamboLogo} alt="Roshambo Logo" />
          <h1 className="mt-2 text-white text-2xl font-bold italic">&nbsp; Mission Control</h1>
        </div>
        <a target="_blank" className="bg-white p-2 px-4 rounded-full hover:bg-blue hover:text-white font-semibold cursor-pointer transition-colors duration-300 text-blue-600 hover:text-blue-400" href="https://open.spotify.com/track/3bpfZHC60n4K3l5qSGssvm?si=522d97e7cc4142f6">Battle Music &nbsp; 🎶</a>
      </div>
    </header>
  )
}

export default Header