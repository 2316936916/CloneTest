import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScroll } from 'components/ContentScroll';
import useFontSize from 'hooks/useFontSize';

const Content = React.memo(({
  list,
  itemHeight,
  className,
  onEnd,
}) => {
  const { scrollTop, clientHeight, scrollHeight } = useScroll();
  const fontSize = useFontSize();
  const {
    list: displayList,
    y: offsetY,
  } = useMemo(() => {
    const displayCount = Math.floor(clientHeight / itemHeight) + 1;
    const len = list.length;
    if (len <= (displayCount + 2)) {
      return {
        list,
        y: scrollTop,
      };
    }
    const index = Math.floor(scrollTop / itemHeight);
    const y = Math.min(Math.max(scrollTop - index * itemHeight, 0), itemHeight);
    return {
      y,
      list: list.slice(index, index + displayCount + 1),
    };
  }, [
    list,
    itemHeight,
    clientHeight,
    scrollTop,
  ]);

  useEffect(() => {
    if (!onEnd) {
      return () => {
      };
    }
    const animationFrameID = window.requestAnimationFrame(() => {
      if (scrollTop > scrollHeight - clientHeight - fontSize) {
        onEnd();
      }
    });
    return () => {
      window.cancelAnimationFrame(animationFrameID);
    };
  }, [onEnd, clientHeight, scrollTop, scrollHeight, fontSize]);

  return (
    <div
      style={{
        transform: `translateY(-${offsetY}px)`,
      }}
      className={className}
    >
      {displayList}
    </div>
  );
});

Content.propTypes = {
  className: PropTypes.string,
  itemHeight: PropTypes.number.isRequired,
  list: PropTypes.arrayOf(PropTypes.element).isRequired,
  onEnd: PropTypes.func,
};

export default Content;
