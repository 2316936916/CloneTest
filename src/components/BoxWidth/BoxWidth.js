import {
  memo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import Context from './Context';

const BoxWidth = memo(({
  className,
  style = {},
  ...props
}) => {
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newContainerWidth = Math.floor(entries[0].contentRect.width);
      animationFrameID = window.requestAnimationFrame(() => {
        if (newContainerWidth !== containerWidth) {
          setContainerWidth(newContainerWidth);
        }
      });
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  return (
    <Context.Provider
      value={containerWidth}
    >
      <div
        ref={containerRef}
        className={className}
        style={{
          ...style,
          ...containerWidth === 0
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

BoxWidth.propTypes = {
  width: PropTypes.number,
  className: PropTypes.string,
  style: stylePropType,
};

export default BoxWidth;
