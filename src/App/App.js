/* eslint react/jsx-no-useless-fragment: 0 */
import {
  memo,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react';

import colorData from 'colors.json';
import { colorFormatHSL } from 'utils';

import ColorContext from 'contexts/Color';
import FontSizeContext from 'contexts/FontSize';

import Styles from './Styles';

import Context from './Context';
import useRootState from './useState';
import Toastr from './Toastr';
import Loading from './Loading';
import Container from './Container';

const initFontSize = Math.floor(parseFloat(getComputedStyle(document.body).fontSize));

const colorDataInit = process.env.NODE_ENV === 'development'
  ? Object
    .keys(colorData)
    .reduce((acc, cur) => ({
      ...acc,
      [cur]: colorFormatHSL(colorData[cur]),
    }), {})
  : colorData;

const App = memo(() => {
  const store = useRootState();
  const [fontSize, setFontSize] = useState(initFontSize);
  const [color, setColor] = useState(colorDataInit);

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver(() => {
      const newFontSize = Math.floor(parseFloat(getComputedStyle(document.body).fontSize));
      if (newFontSize !== fontSize) {
        animationFrameID = window.requestAnimationFrame(() => {
          setFontSize(newFontSize);
        });
      }
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  const colorState = useMemo(() => ({
    data: color,
    change: setColor,
  }), [color]);

  return (
    <Context.Provider
      value={store}
    >
      <FontSizeContext.Provider
        value={fontSize}
      >
        <ColorContext.Provider
          value={colorState}
        >
          <Styles />
          <Container />
          <Toastr />
          <Loading />
        </ColorContext.Provider>
      </FontSizeContext.Provider>
    </Context.Provider>
  );
});

export default App;
