import {
  memo,
  useRef,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useFontSize from 'hooks/useFontSize';
import useRectPosition from 'hooks/useRectPosition';
import useZIndex from 'hooks/useZIndex';
import useElemRect from 'hooks/useElemRect';
import ContentScroll, { ScrollBar } from 'components/ContentScroll';
import Content from './Content';

const DISPLAY_COUNT = 8;

const PopList = memo(({
  className,
  list,
  children,
  elem,
  onHide,
  itemHeight: _itemHeight,
}) => {
  const container = useRef();
  const fontSize = useFontSize();
  const zIndex = useZIndex();
  const itemHeight = _itemHeight || fontSize * 2.2;
  const containerHeight = Math.min(list.length, DISPLAY_COUNT) * itemHeight;
  const rect = useElemRect(elem);

  const [x, y] = useRectPosition(rect.width, containerHeight, rect);

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
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        `}
        className={className}
        onMouseDown={(ev) => ev.preventDefault()}
        ref={container}
        style={{
          top: y,
          left: x,
          width: rect.width,
          zIndex,
        }}
      >
        <ContentScroll
          scrollHeight={itemHeight * list.length}
          height={list.length > DISPLAY_COUNT ? itemHeight * DISPLAY_COUNT : itemHeight * list.length}
        >
          <Content
            itemHeight={itemHeight}
            list={list}
            displayCount={DISPLAY_COUNT}
          >
            {children}
          </Content>
          <ScrollBar />
        </ContentScroll>
      </div>
    ),
    document.body,
  );
});

PopList.propTypes = {
  list: PropTypes.array.isRequired, // eslint-disable-line
  className: PropTypes.string,
  children: PropTypes.func.isRequired,
  itemHeight: PropTypes.number,
  elem: PropTypes.instanceOf(Element).isRequired,
  onHide: PropTypes.func,
};

export default PopList;
