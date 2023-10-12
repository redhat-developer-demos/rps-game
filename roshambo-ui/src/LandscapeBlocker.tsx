import React, { useEffect, useState } from 'react';
import RoshamboLogo from './assets/2023_Roshambo_UI__Roshambo_Logo_only.svg'

/**
 * The application is designed with portrait mode in mind. This component
 * will render a message that instructs users to switch to portrait mode on
 * mobile devices so they aren't presented with an ugly UI.
 */

const LandscapeBlocker: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [ active, setActive ] = useState<boolean>(false)

  function isLandscapeMode () {
    return window.innerWidth > window.innerHeight
  }

  function isMobile () {
    return navigator.userAgent.match(/ipad|android|iphone|ios/gi) !== null
  }

  useEffect(() => {
    function resizeListener () {
      setActive(isLandscapeMode() && isMobile())
    }

    window.addEventListener('resize', resizeListener)

    resizeListener()

    return () => window.removeEventListener('resize', resizeListener)
  })

  if (active) {
    return (
      <div className="py-8 text-xl m-auto text-center">
        <img src={RoshamboLogo} className='h-20 m-auto' alt="Roshambo Logo" />
        <h1>Rotate your device to portrait orientation to play the game!</h1>
      </div>
    )
  } else {
    return <>{children}</>
  }
};

export default LandscapeBlocker;
