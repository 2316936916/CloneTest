import {
  useContext,
  useCallback,
  useRef,
} from 'react';
import chroma from 'chroma-js';
import { colorFormatHSL } from 'utils';
import ColorContext from 'contexts/Color';
import useInterval from 'hooks/useInterval';

 const isDev = process.env.NODE_ENV === 'development';

const useColor = () => {
  const { data, change } = useContext(ColorContext);
  const colorsSaved = useRef();

  useInterval(() => {
    if (colorsSaved.current) {
      change((prev) => {
        const next = {
          ...prev,
          ...colorsSaved.current,
        };
        return next;
      });
      colorsSaved.current = null;
    }
  }, isDev ? 200 : 2 ** 31 - 1);

  const getColor = useCallback((key) => {
    const value = data[key];
    if (!isDev) {
      return value || key;
    }
    if (value) {
      return colorFormatHSL(value);
    }
    const dataKey = key.toLowerCase();
    if (data[dataKey]) {
      return colorFormatHSL(data[dataKey]);
    }
    if (chroma.valid(dataKey)) {
      if (!colorsSaved.current || !colorsSaved.current[dataKey]) {
        colorsSaved.current = {
          ...colorsSaved.current || {},
          [dataKey]: colorFormatHSL(dataKey),
        };
      }
      return colorFormatHSL(dataKey);
    }
    console.warn(`color: ${dataKey} invalid`);
    return null;
  }, [data]);

  return getColor;
};

export default useColor;
