import { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { useScroll } from 'components/ContentScroll';

const Content = memo(({
  itemHeight,
  list,
  children,
  displayCount,
}) => {
  const { scrollTop } = useScroll();

  const {
    list: displayList,
    y: offsetY,
    index: offsetIndex,
  } = useMemo(() => {
    const len = list.length;
    if (len <= (displayCount + 2)) {
      return {
        list,
        y: scrollTop,
        index: 0,
      };
    }
    const index = Math.floor(scrollTop / itemHeight);
    const y = Math.min(Math.max(scrollTop - index * itemHeight, 0), itemHeight);
    return {
      index,
      y,
      list: list.slice(index, index + displayCount + 1),
    };
  }, [
    list,
    itemHeight,
    scrollTop,
    displayCount,
  ]);

  return (
    <div
      style={{
        transform: `translateY(-${offsetY}px)`,
      }}
    >
      {
        displayList
          .map((item, i) => (
            <div
              key={item._id}
              style={{
                height: itemHeight,
              }}
            >
              {children(item, i + offsetIndex)}
            </div>
          ))
      }
    </div>
  );
});

Content.propTypes = {
  itemHeight: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  displayCount: PropTypes.number.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
  })).isRequired,
};

export default Content;
