import React from 'react';
import DeveloperLogo from './assets/2023_Roshambo_UI__RHD_Logo.svg'
import TitleArt from './assets/2023_Roshambo_UI_Title_art.png'
import RoshamboLogo from './assets/2023_Roshambo_UI__Roshambo_Logo_Descrip_W.svg'
import { Link } from 'react-router-dom';



const TitlePage: React.FunctionComponent = () => {  
  return (
    <div style={{height: '100svh'}} className="flex flex-col place-content-center items-center gap-4 px-4">
      <img src={RoshamboLogo} alt="Roshambo Game Logo" />
      <img src={TitleArt} alt="Game Title Artwork" className='max-h-64' />

      <Link to={'/instructions'} className='bg-blue text-2xl py-3 px-14 rounded font-semibold'>
        Start Game
      </Link>

      <div className='pt-2'>
        <p className='text-sm'>Powered by</p>
        <a target='_blank' className='underline text-sm text-sky-500' href='https://red.ht/openshift_ai'>Red Hat OpenShift AI</a>
      </div>

      <div className='flex flex-row w-full gap-4 pt-2 px-20'>
        <p className='text-sm my-4 flex-1'>Presented by</p>
        <div className='flex-1'>
          <img className='w-full h-full' src={DeveloperLogo} alt="Red Hat Developer Logo" />
        </div>
      </div>
    </div>
  );
};

export default TitlePage;
