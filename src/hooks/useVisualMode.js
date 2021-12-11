import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    setMode(newMode);
    setHistory(prev => {
      const arr = [...prev, newMode];
      if (replace) {
        arr.splice(-2, 1);// remove the second last in history
      }
      return arr;
    });
  };

  const back = function() {
    if (history.length > 1) {
      const removeOne = history.slice(0, -1);
      setHistory(removeOne);
      setMode(removeOne[removeOne.length - 1])
    }
  };

  return { mode, transition, back };
}