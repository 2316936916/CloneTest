import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';

const useZIndex = () => {
  const [zIndex, setZIndex] = useState(201);
  const mountedSaved = useRef(true);

  useLayoutEffect(() => {
    mountedSaved.current = true;
    return () => {
      mountedSaved.current = false;
    };
  }, []);

  useEffect(() => {
    let max = 1;
    Array.from(document.body.children).forEach((child) => {
      const v = getComputedStyle(child).zIndex;
      if (v && parseInt(v, 10) > max) {
        max = parseInt(v, 10);
      }
    });
    if (mountedSaved.current) {
      setZIndex(max + 1);
    }
  }, []);

  return zIndex;
};

export default useZIndex;
