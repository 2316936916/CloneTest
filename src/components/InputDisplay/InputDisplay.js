import React, { memo } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';

const InputDisplay = memo(({
  value,
  fx = (v) => v,
  className,
  forwardRef,
  style,
  ...props
}) => (
  <div
    title={fx(value)}
    css={css`
      height: 2.6rem;
      width: 100%;
      border: 1px solid #DADADA;
      background: #F3F3F3;
      border-radius: 2px;
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 0.6rem;
      padding-right: 0.6rem;
    `}
    style={style}
    className={className}
    {...props}
  >
    <span
      css={css`
        width: 100%;
        height: 100%;
        align-items: center;
        white-space: nowrap;
        display: flex;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
    >
      {fx(value)}
    </span>
  </div>
));

InputDisplay.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  fx: PropTypes.func,
  forwardRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default React.forwardRef((props, ref) => (
  <InputDisplay
    {...props}
    forwardRef={ref}
  />
));
