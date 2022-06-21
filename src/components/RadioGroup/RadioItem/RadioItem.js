import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';

const RadioItem = React.memo(({
  name,
  onCheck,
  checked,
  disabled,
  className,
}) => {
  const getColor = useColor();

  return (
    <a
      css={css`
        display: flex-inline;
        align-items: center;
        text-decoration: none;
        cursor: pointer;
      `}
      className={className}
      style={{
        cursor: checked ? 'Default' : disabled ? 'not-allowed' : null,
      }}
      onClick={() => {
        if (!disabled && !checked) {
          onCheck();
        }
      }}
      aria-label="radio"
    >
      <svg
        css={css`
          width: 1rem;
          height: 1rem;
        `}
        viewBox="0 0 10 10"
      >
        <g
          transform="translate(5, 5)"
        >
          <circle
            fill={checked ? getColor('a00') : '#ccc'}
            r={5}
          />
          <circle
            r={4}
            fill="#fff"
          />
          {
            checked && (
              <circle
                r={2.5}
                fill={getColor('a00')}
              />
            )
          }
        </g>
      </svg>
      <span
        css={css`
          margin-left: 0.3rem;
        `}
      >
        {name}
      </span>
    </a>
  );
});

RadioItem.propTypes = {
  name: PropTypes.string.isRequired,
  onCheck: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default RadioItem;
