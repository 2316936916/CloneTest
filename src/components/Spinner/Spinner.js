import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import _ from 'lodash';

const Spinner = memo(({
  type = 0,
  className,
}) => {
  const map = {
    0: '#ccc',
    1: '#fff',
  };
  const bars = _
    .times(12)
    .map((idx) => (
      <i
        style={{
          animationDelay: `${(idx - 12) / 10}s`,
          transform: `rotate(${idx * 30}deg) translate(146%)`,
        }}
        css={css`
            animation: spinner_spin 1.2s linear infinite;
            background-color: ${map[type]};
            border-radius: 3px;
            height: 7.8%;
            left: -10%;
            position: absolute;
            top: -3.9%;
            width: 20%;
          `}
        key={idx}
      />
    ));

  return (
    <span
      css={css`
        height: 2rem;
        width: 2rem;
        position: absolute;
        z-index: 22;
        top: 50%;
        left: 50%;
        pointer-events: none;
        @keyframes spinner_spin {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}
      className={className}
    >
      {bars}
    </span>
  );
});

Spinner.propTypes = {
  type: PropTypes.oneOf([0, 1]),
  className: PropTypes.string,
};

export default Spinner;
