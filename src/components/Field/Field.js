import { memo } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { css } from '@emotion/react';

const Field = memo(({
  isActive,
  style = {},
  ...props
}) => (
  <div
    css={css`
        display: flex;
        justify-content: space-between;
        background: #fff;
        border-radius: 3px;
        align-items: center;
        transition: border-color 0.3s, background 0.3s;
        border: 1px solid #ccc;
        position: relative;
        height: 2.6rem;
      `}
    style={{
      ...style,
      borderColor: isActive ? '#333' : style.borderColor,
    }}
    {...props}
  />
));

Field.propTypes = {
  isActive: PropTypes.bool,
  style: stylePropType,
};

export default Field;
