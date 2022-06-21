import { useState, useLayoutEffect, useRef } from 'react';
import _ from 'lodash';

const rectAttributeNames = ['width', 'height', 'x', 'y'];

const useElemRect = (elem) => {
  const mountedSaved = useRef();
  const [rect, setRect] = useState(elem
    ? _.pick(elem.getBoundingClientRect(), rectAttributeNames)
    : {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    mountedSaved.current = true;
    return () => {
      mountedSaved.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver(() => {
      const _rect = _.pick(elem.getBoundingClientRect(), rectAttributeNames);
      animationFrameID = window.requestAnimationFrame(() => {
        if (mountedSaved.current) {
          setRect(_rect);
        }
      });
    });
    if (elem) {
      observer.observe(elem);
    }
    return () => {
      observer.disconnect();
      if (animationFrameID) {
        window.cancelAnimationFrame(animationFrameID);
      }
    };
  }, [elem]);

  return rect;
};

export default useElemRect;
