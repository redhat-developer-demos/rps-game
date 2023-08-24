import React, { useEffect } from 'react';

const HeightWrapper: React.FC<{ children: JSX.Element }> = ({ children }) => {
  
  useEffect(() => {
    function resizeListener () {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    }

    window.addEventListener('resize', resizeListener)

    resizeListener()

    return () => window.removeEventListener('resize', resizeListener)
  })

  return (
    <>{children}</>
  )
};

export default HeightWrapper;
