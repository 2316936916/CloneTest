import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';

const IconBtn = React.memo(({
  code,
  color,
  forwardedref,
  pending,
  ...other
}) => (
  <button
    type="button"
    css={css`
        width: 1.8rem;
        height: 1.8rem;
        border-width: 0;
        outline: unset;
        background: rgba(0, 0, 0, 0);
        display: inline-block;
        position: relative;
        color: ${color || '#666'};
        pointer-events: ${pending ? 'none' : 'all'};
      `}
    ref={forwardedref}
    {...other}
  >
    {
        pending ? (
          <Spinner
            css={css`
              width: 100%;
              height: 100%;
            `}
          />
        ) : (
          <Icon
            css={css`
              width: 100%;
              height: 100%;
              display: block;
              pointer-events: none;
            `}
            code={code}
            color="currentColor"
          />
        )
      }
  </button>
  ));

IconBtn.propTypes = {
  pending: PropTypes.bool,
  color: PropTypes.string,
  code: PropTypes.string.isRequired,
  forwardedref: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default React.forwardRef((props, ref) => (
  <IconBtn
    {...props}
    forwardedref={ref}
  />
));
