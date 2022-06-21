import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import stylePropType from 'react-style-proptype';
import useColor from 'hooks/useColor';
import useFontSize from 'hooks/useFontSize';
import { Row as Component } from 'components/Column';

const Row = memo(({
  itemHeight,
  style = {},
  ...props
}) => {
  const fontSize = useFontSize();
  const getColor = useColor();
  return (
    <Component
      css={css`
        transition: background 0.3s;
        background: #fff;
        border-bottom: 1px solid #e6e6e6;
        > div {
          padding-left: 0.4rem;
          padding-right: 0.4rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
          > span[title],
          > a[title] {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        &:hover {
          background: ${getColor('#f0f0f0')};
          [aria-label=operations] {
            display: flex;
          }
        }
      `}
      style={{
        ...style,
        height: itemHeight || fontSize * 3.2,
      }}
      {...props}
    />
  );
});

Row.propTypes = {
  itemHeight: PropTypes.number,
  style: stylePropType,
};

export default Row;
