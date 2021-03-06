import { useRef, useMemo, memo } from 'react';
import { css } from '@emotion/react';
import useScroll from '../useScroll';

const ScrollBar = memo(() => {
  const barRef = useRef();
  const startPointerSaved = useRef();
  const {
    clientHeight,
    scrollHeight,
    percent,
    onScroll,
    scrollTop,
  } = useScroll();

  const scrollBarHeight = useMemo(() => {
    const diffHeight = scrollHeight - clientHeight;
    if (diffHeight <= 0) {
      return 0;
    }
    if (clientHeight * 0.8 > diffHeight) {
      return clientHeight - diffHeight;
    }
    return clientHeight * 0.3;
  }, [clientHeight, scrollHeight]);

  const handleMouseMoveOnDoc = (ev) => {
    const y = ev.clientY - startPointerSaved.current.y;
    const effectHeight = clientHeight - scrollBarHeight;
    let next = startPointerSaved.current.scrollTop + (scrollHeight - clientHeight) / effectHeight * y; // eslint-disable-line
    if (next < 0) {
      next = 0;
    }
    if (next > scrollHeight - clientHeight) {
      next = scrollHeight - clientHeight;
    }
    if (next !== startPointerSaved.current.next) {
      startPointerSaved.current = {
        x: ev.clientX,
        y: ev.clientY,
        scrollTop: next,
      };
      onScroll(next);
    }
  };

  const handleMouseUpOnDoc = () => {
    document.removeEventListener('mousemove', handleMouseMoveOnDoc);
    document.removeEventListener('mouseup', handleMouseUpOnDoc);
    startPointerSaved.current = null;
    document.body.style.userSelect = null;
  };

  const handleMouseDown = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    if (ev.target !== barRef.current) {
      const y = ev.clientY - ev.target.getBoundingClientRect().y;
      const percentTo = y / clientHeight;
      onScroll((scrollHeight - clientHeight) * percentTo);
    } else {
      document.body.style.userSelect = 'none';
      startPointerSaved.current = {
        x: ev.clientX,
        y: ev.clientY,
        scrollTop,
      };
      document.addEventListener('mousemove', handleMouseMoveOnDoc);
      document.addEventListener('mouseup', handleMouseUpOnDoc);
    }
  };

  if (clientHeight === 0 || clientHeight >= scrollHeight) {
    return null;
  }

  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 6px;
        border-radius: 3px;
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        z-index: 1;
      `}
      aria-label="scrollbar"
      onMouseDown={handleMouseDown}
    >
      <div
        css={css`
          position: absolute;
          left: 0;
          width: 100%;
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.25);
        `}
        ref={barRef}
        style={{
          height: scrollBarHeight,
          top: (clientHeight - scrollBarHeight) * percent,
        }}
      />
    </div>
  );
});

export default ScrollBar;
