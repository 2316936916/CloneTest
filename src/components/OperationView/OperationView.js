import { memo } from 'react';
import { css } from '@emotion/react';

const OperationView = memo((props) => (
  <div
    aria-label="operations"
    onClick={(ev) => ev.stopPropagation()}
    css={css`
        display: none;
        width: 100%;
        align-items: center;
        justify-content: center;
        > button {
          width: 1.2rem;
          height: 1.2rem;
        }
        > button:not(:first-of-type) {
          margin-left: 0.4rem;
        }
      `}
    {...props}
  />
));

export default OperationView;
