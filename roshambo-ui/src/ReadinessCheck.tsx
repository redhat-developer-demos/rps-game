import React, { useContext } from 'react';
import { useActor } from '@xstate/react';
import { StateMachineContext } from './StateMachineProvider';
import { Navigate } from 'react-router-dom';

const ReadinessCheck: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [ state ] = useActor(useContext(StateMachineContext))

  if (!state.context.config || !state.context.user) {
    // If the config isn't loaded, then the user probably came directly here
    // without visiting the instructions page
    return <Navigate to="/"></Navigate>
  } else {
    return <>{children}</>
  }
};

export default ReadinessCheck;
