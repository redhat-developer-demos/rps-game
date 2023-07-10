import './Waiting.css'
import React from 'react'
import IconRow from './IconRow'

const Waiting: React.FunctionComponent<{ message?: string }> = ({ message }) => {
  return (
    <div className='h-full grid grid-rows-2 pb-12'>
      <div className="grid items-end">
        <IconRow animated={true}></IconRow>
      </div>
      <h2 className='text-white relative pt-6 md:pt-16 w-full text-center text-2xl'>{ message }</h2>
    </div>
  );
}

export default Waiting