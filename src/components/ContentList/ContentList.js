import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ContentScroll, { ScrollBar } from 'components/ContentScroll';
import Content from './Content';

const ContentList = React.memo(({
  children,
  itemHeight,
  className,
  scrollBarShow,
  onEnd,
}) => {
  const childrenList = useMemo(() => React
    .Children
    .toArray(children)
    .filter((child) => child.type), [children]);
  const count = useMemo(() => childrenList.length, [childrenList]);

  return (
    <ContentScroll
      scrollHeight={itemHeight * count}
    >
      <Content
        className={className}
        itemHeight={itemHeight}
        list={childrenList}
        onEnd={onEnd}
      />
      {
        scrollBarShow && (
          <ScrollBar />
        )
      }
    </ContentScroll>
  );
});

ContentList.propTypes = {
  className: PropTypes.string,
  itemHeight: PropTypes.number.isRequired,
  scrollBarShow: PropTypes.bool,
  onEnd: PropTypes.func,
  children: PropTypes.any, // eslint-disable-line
};

export default ContentList;
