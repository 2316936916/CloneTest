import { memo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useFontSize from 'hooks/useFontSize';
import useRectPosition from 'hooks/useRectPosition';
import useElemRect from 'hooks/useElemRect';

const CascaderPopList = memo(({
  className,
  children,
  elem,
  onHide,
  height = 2.2,
  columnWidth = 12,
  itemNum = 7,
}) => {
  const container = useRef();
  const fontSize = useFontSize();
  const itemHeight = fontSize * height;
  const containerHeight = itemNum * itemHeight;
  const rect = useElemRect(elem);
  const [x, y] = useRectPosition(columnWidth * 3, containerHeight, rect);

  useEffect(() => {
    const handleClick = (ev) => {
      if (onHide
        && container.current
        && !container.current.contains(ev.target)
        && !elem.contains(ev.target)
      ) {
        onHide();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onHide, elem]);

  return ReactDOM.createPortal(
    (
      <div
        css={css`
          position: absolute;
          background: #fff;
          box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
          z-index: 1009;
        `}
        className={className}
        onMouseDown={(ev) => ev.preventDefault()}
        ref={container}
        style={{
          top: y,
          left: x,
          height: containerHeight,
        }}
      >
        {children}
      </div>
  ), document.body,
  );
});

CascaderPopList.propTypes = {
  list: PropTypes.array, // eslint-disable-line
  className: PropTypes.string,
  children: PropTypes.any, // eslint-disable-line
  elem: PropTypes.instanceOf(Element).isRequired,
  onHide: PropTypes.func,
  height: PropTypes.number,
  columnWidth: PropTypes.number,
  itemNum: PropTypes.number,
};

export default CascaderPopList;
