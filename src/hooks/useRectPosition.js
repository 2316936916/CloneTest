import { useMemo } from 'react';
import useFontSize from 'hooks/useFontSize';

const useRectPosition = (containerWidth, containerHeight, rect) => {
  const fontSize = useFontSize();

  const position = useMemo(() => {
    const { clientWidth } = document.documentElement;
    const { clientHeight } = document.documentElement;
    let _x = rect.x;
    let _y = rect.y + rect.height;
    if (_x > clientWidth - containerWidth) {
      _x = clientWidth - containerWidth;
    }
    if (_y > clientHeight - containerHeight - fontSize * 0.6) {
      _y = rect.y - containerHeight;
    }
    return [_x, _y];
  }, [
    rect,
    fontSize,
    containerWidth,
    containerHeight,
  ]);

  return position;
};

export default useRectPosition;
