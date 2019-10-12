import React from 'react'
import { useStopwatch } from 'react-timer-hook'


export const Timer = () => {
  const {
    seconds,
    minutes,
    hours,
    days,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });  

  return (
    <div>
      <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}