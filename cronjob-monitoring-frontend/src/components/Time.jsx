import React, { useEffect, useState } from 'react';
import moment from 'moment';

import classes from './Time.module.css';

const Time = () => {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment());
    }, 1000); // Update every 1 second

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <div className={classes.container}>
      <p>Today is {currentTime.format('LL HH:mm:ss')}</p>
    </div>
  );
}

export default Time;