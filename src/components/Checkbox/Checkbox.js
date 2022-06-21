import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';
const Checkbox = React.memo(({
  name,
  value,
  onChange,
}) => {
  const radian = Math.PI * -45 / 180;
  const getColor = useColor();

  return (
    <a
      css={css`
        display: inline-flex;
        align-items: center;
      `}
      onClick={() => {
        onChange(!value);
      }}
    >
      <svg
        css={css`
          width: 1.4rem;
          height: 1.4rem;
          flex-shrink: 0;
        `}
        viewBox="0 0 12 12"
      >
        <rect
          rx={2}
          ry={2}
          width={12}
          height={12}
          strokeWidth={2}
          fill={getColor('a00')}
          stroke={value ? getColor('a00') : '#999'}
          fillOpacity={value ? 1 : 0}
          css={css`
            transition: 0.3s fill-opacity;
          `}
        />
        <path
          d={`
            M2 1
            V5
            H9
          `}
          fill="none"
          stroke="#fff"
          strokeWidth={1.5}
          transform={`matrix(${Math.cos(radian)}, ${Math.sin(radian)}, ${-Math.sin(radian)}, ${Math.cos(radian)}, 0, 6)`}
          strokeDasharray={11}
          strokeDashoffset={value ? 0 : 11}
          strokeOpacity={value ? 1 : 0}
          css={css`
            transition: all 0.6s;
          `}
        />
      </svg>
      <span
        css={css`
          margin-left: 0.5rem;
          font-size: 1.1rem;
          color: #999;
          white-space: nowrap;
        `}
        style={{
          color: value ? '#666' : null,
        }}
      >
        {name}
      </span>
    </a>
  );
});

Checkbox.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
