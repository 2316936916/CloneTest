import { memo } from 'react';
import PropTypes from 'prop-types';
import useFontSize from 'hooks/useFontSize';
import ContentList from 'components/ContentList';

const Body = memo(({
  children,
  itemHeight,
  ...other
}) => {
  const fontSize = useFontSize();
  return (
    <ContentList
      itemHeight={itemHeight || fontSize * 3.2}
      scrollBarShow
      {...other}
    >
      {children}
    </ContentList>
  );
});

Body.propTypes = {
  itemHeight: PropTypes.number,
  children: PropTypes.any, // eslint-disable-line
};

export default Body;
