import React, {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import Context from './Context';

const Box = React.memo(({
  className,
  style = {},
  ...props
}) => {
  const container = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newContainerWidth = Math.floor(entries[0].contentRect.width);
      const newContainerHeight = Math.floor(entries[0].contentRect.height);
      animationFrameID = window.requestAnimationFrame(() => {
        if (newContainerWidth !== containerWidth || newContainerHeight !== containerHeight) {
          setContainerWidth(newContainerWidth);
          setContainerHeight(newContainerHeight);
        }
      });
    });
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  const state = useMemo(() => ({
    containerWidth,
    containerHeight,
  }), [containerWidth, containerHeight]);

  return (
    <Context.Provider
      value={state}
    >
      <div
        ref={container}
        className={className}
        style={{
          ...style,
          ...containerWidth === 0 || containerHeight === 0
            ? {
              visibility: 'hidden',
              opacity: 0,
            }
            : {},
        }}
        {...props}
      />
    </Context.Provider>
  );
});

Box.propTypes = {
  className: PropTypes.string,
  style: stylePropType,
};

export default Box;
