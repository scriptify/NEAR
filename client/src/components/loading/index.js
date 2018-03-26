import React from 'react';
import './index.css';
import spinner from './spinner.svg';

const Loading = ({ text }) => {
  return (
    <div className={`loading`}>
      <div className={`loading__icon`}>
        <img src={spinner} alt={`Loading`} />
      </div>
      <div className={`loading__text`}>{text}</div>
    </div>
  );
};


export default Loading;
