import './Waiting.css'
import React from 'react'

const Waiting: React.FunctionComponent<{ message: string }> = ({ message }) => {
  return (
    <div>
      <h2 className='text-xl mb-4'>{ message }</h2>

      {/* https://codepen.io/t_afif/pen/yLMXBRL */}
      <div className="spinner-5"></div>
    </div>
  );
}

export default Waiting