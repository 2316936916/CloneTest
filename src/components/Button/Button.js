import { memo } from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import { css } from '@emotion/react';
import { colorify } from 'utils';
import Spinner from 'components/Spinner';
import useColor from 'hooks/useColor';

const Button = memo(({
  type = 'default',
  pending,
  children,
  border,
  block,
  disabled,
  ...other
}) => {
  const getColor = useColor();
  const themeMap = {
    default: {
      background: border ? '#666' : '#fff',
      borderColor: '#666',
      color: border ? '#fff' : '#666',
      active: {
        color: border ? chroma('#666').darken(0.6).css() : '#fff',
        background: border ? chroma('#fff').darken(0.4).css() : chroma('#666').darken(0.6).css(),
      },
    },
    primary: {
      background: border ? '#fff' : colorify(getColor('a00')),
      borderColor: colorify(getColor('a00')),
      color: border ? colorify(getColor('a00')) : '#fff',
      active: {
        color: border ? chroma(colorify(getColor('a00'))).darken(0.6).css() : '#fff',
        background: border ? '#fff' : chroma(colorify(getColor('a00'))).darken(0.6).css(),
      },
    },
    danger: {
      background: border ? '#fff' : colorify(getColor('a05')),
      borderColor: colorify(getColor('a05')),
      color: border ? colorify(getColor('a05')) : '#fff',
      active: {
        color: border ? chroma(colorify(getColor('a05'))).darken(0.6).css() : '#fff',
        background: border ? '#fff' : chroma(colorify(getColor('a05'))).darken(0.6).css(),
      },
    },
    dangerGhost: {
      background: '#fff',
      borderColor: ('a05'),
      color: ('a05'),
      active: {
        color: border ? chroma(colorify(getColor('a05'))).darken(0.6).css() : '#fff',
        background: border ? '#fff' : chroma(colorify(getColor('a05'))).darken(0.6).css(),
      },
    },
  };

  const theme = themeMap[type];

  return (
    <button
      type="button"
      css={css`
        position: relative;
        font-size: 1rem;
        font-family: inherit;
        border-width: 0;
        outline: 0;
        height: 2.6rem;
        padding: 0 0.9rem;
        border-radius: 3px;
        background: ${theme.background};
        color: ${pending ? 'rgba(0, 0, 0, 0)' : theme.color};
        border: 1px solid ${theme.borderColor};
        pointer-events: ${pending ? 'none' : 'all'};
        display: ${block ? 'flex' : 'inline-flex'};
        align-items: center;
        justify-content: center;
        user-select: ${pending ? 'none' : 'auto'};
        width: ${block ? '100%' : 'auto'};
        white-space: nowrap;
        transition: background 0.3s, color 0.3s, border-color 0.3s;
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        &:active {
          color: ${theme.active.color};
          border-color: ${chroma(theme.borderColor).darken(0.6).css()};
          background: ${theme.active.background};
        }
      `}
      {...other}
    >
      {
        pending && (
          <Spinner
            type={1}
          />
        )
      }
      {
        children
      }
    </button>
  );
});

Button.propTypes = {
  type: PropTypes.oneOf(['default', 'primary', 'danger', 'dangerGhost']),
  block: PropTypes.bool,
  border: PropTypes.bool,
  pending: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.any, // eslint-disable-line
};

export default Button;
