import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';

const Field = React.memo(({
  isActive,
  style = {},
  ...props
}) => {
  const getColor = useColor();
  return (
    <div
      css={css`
          display: flex;
          justify-content: space-between;
          background: #fff;
          border-radius: 2px;
          align-items: center;
          transition: border-color 0.3s, background 0.3s;
          border: 1px solid rgba(0, 0, 0, 0.15);
          position: relative;
          height: 2.6rem;
        `}
      style={{
        ...style,
        borderColor: isActive ? getColor('a00') : style.borderColor,
      }}
      {...props}
    />
  );
});

Field.propTypes = {
  isActive: PropTypes.bool,
  style: stylePropType,
};

export default Field;
