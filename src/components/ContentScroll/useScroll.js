import { useMemo, useContext } from 'react';
import Context from './Context';

const useScroll = () => {
  const state = useContext(Context);

  const store = useMemo(() => {
    if (!state) {
      return {
        scrollTop: 0,
        clientHeight: 0,
        scrollHeight: 0,
        percent: 0,
        scrolling: false,
      };
    }
    const {
      scrollTop = 0,
      scrollHeight = 0,
      clientHeight = 0,
      onScroll,
      setScroll,
      scrolling,
    } = state;
    let percent;
    if (scrollHeight === 0 || clientHeight === 0) {
      percent = 0;
    } else if (scrollHeight <= clientHeight) {
      percent = 0;
    } else {
      percent = scrollTop / (scrollHeight - clientHeight);
    }
    return {
      percent,
      scrollTop,
      clientHeight,
      scrollHeight,
      scrolling,
      onScroll,
      setScroll,
    };
  }, [state]);

  return store;
};

export default useScroll;
