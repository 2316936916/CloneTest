import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
} from 'react';

const calc = (size, range, gap) => {
  const len = range.length;
  if (size === 0 || len === 0) {
    return [];
  }

  if (gap != null && gap !== 0) {
    if (gap >= 1) {
      size -= Math.max((range.length - 1), 0) * gap; // eslint-disable-line no-param-reassign
    } else {
      size -= size * gap * Math.max(range.length - 1, 0); // eslint-disable-line no-param-reassign
    }
  }

  const fixedSizeList = range
    .filter((d) => typeof d === 'number' && d >= 1);
  const percentSizeList = range
    .filter((d) => typeof d === 'number' && d < 1);

  const fiexdUsaged = fixedSizeList.reduce((acc, cur) => acc + cur, 0);
  const percentUsaged = percentSizeList.reduce((acc, cur) => acc + cur, 0);
  if (fiexdUsaged > size || percentUsaged > 1) {
    console.error('size usage exceed container size');
    return [];
  }
  const restCount = len - fixedSizeList.length - percentSizeList.length;
  const restPerPercent = restCount === 0
    ? 0
    : (1 - fiexdUsaged / size - percentUsaged) / restCount;
  return range
    .map((item) => {
      if (typeof item === 'number') {
        return {
          percent: item >= 1 ? item / size : item,
          size: item >= 1 ? item : item * size,
          raw: item,
        };
      }
      return {
        percent: restPerPercent,
        size: restPerPercent * size,
        raw: null,
      };
    });
};

const useScale = (size, range, gap = 0) => {
  const [list, setList] = useState(calc(size, range));
  const rangeSaved = useRef(range);
  useLayoutEffect(() => {
    rangeSaved.current = range;
  }, [range]);
  const rangeStringify = useMemo(() => range.join(','), [range]);

  useEffect(() => {
    setList(calc(size, rangeSaved.current, gap));
  }, [size, rangeStringify, gap]);

  return list;
};

export default useScale;
