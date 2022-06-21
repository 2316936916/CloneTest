import {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import qs from 'qs';

const defaultFn = (v) => qs.stringify(v);

const useQueryString = (params, tickTime = 10, fn = defaultFn) => {
  const mountedSaved = useRef();
  const [queryString, setQueryString] = useState(null);

  const paramsStr = useMemo(() => {
    if (params == null) {
      return '';
    }
    return fn(params);
  }, [params, fn]);

  useLayoutEffect(() => {
    mountedSaved.current = true;
    return () => {
      mountedSaved.current = false;
    };
  }, []);

  useEffect(() => {
    const tickID = setTimeout(() => {
      if (mountedSaved.current) {
        setQueryString(paramsStr);
      }
    }, tickTime);
    return () => {
      clearTimeout(tickID);
    };
  }, [paramsStr, setQueryString, tickTime]);

  return queryString;
};

export default useQueryString;
