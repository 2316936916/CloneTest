import {
  useLayoutEffect,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useLocation } from 'wouter';

const cache = {
};

const useRouteState = (state, dispatch, actions) => {
  const [location] = useLocation();
  const stateSaved = useRef();
  const dispatchSaved = useRef(dispatch);
  const actionsSaved = useRef(actions);

  useLayoutEffect(() => {
    stateSaved.current = state;
  }, [state]);

  useEffect(() => {
    if (cache[location]) {
      if (actionsSaved.current.change) {
        const _state = cache[location];
        cache[location] = null;
        dispatchSaved.current(actionsSaved.current.change(_state));
      }
    }
    return () => {
      if (actionsSaved.current.change) { // eslint-disable-line
        cache[location] = stateSaved.current;
      }
    };
  }, [location]);

  const _dispatch = useMemo(() => ({
    ...Object.keys(actions).reduce((acc, actionName) => ({
      ...acc,
      [actionName]: (payload) => dispatch(actions[actionName](payload)),
    }), {}),
  }), [
    dispatch,
    actions,
  ]);

  return {
    state: cache[location] || state,
    dispatch: _dispatch,
  };
};

export default useRouteState;
