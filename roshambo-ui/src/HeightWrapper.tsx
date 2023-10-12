import React, { useEffect } from 'react';

/**
 * The address bar appearing/disappearing in Safari on iOS causes the page to
 * dynamically change height when a user scrolls. This is an issue for a full
 * screen application such as this one. It might be possible to address using
 * the new "svh" unit height, but the technique in this file (plus index.css)
 * works to dynamically resize the application to fit available space.
 */

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
