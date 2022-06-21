import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { css } from '@emotion/react';
import Column from 'components/Column';
import BoxWidth from 'components/BoxWidth';

const Table = React.memo(({
  children,
  list,
  className,
  style,
}) => (
  <BoxWidth
    css={css`
      background: #fff;
      border-radius: 3px;
      border: 1px solid rgba(110, 117, 130, 0.2);
      height: 100%;
    `}
    className={className}
    style={style}
  >
    <Column
      list={list}
    >
      {children}
    </Column>
  </BoxWidth>
));

Table.propTypes = {
  children: PropTypes.any, // eslint-disable-line
  list: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    width: PropTypes.number,
  })).isRequired,
  className: PropTypes.string,
  style: stylePropType,
};

export default Table;
