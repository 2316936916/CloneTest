import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Paper from 'components/Paper';

const Card = memo(({
  children,
  name,
  className,
}) => (
  <Paper
    className={className}
  >
    <div
      css={css`
        height: 3.2rem;
        padding: 0 1.2rem;
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        font-weight: bold;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      `}
    >
      <span>
        {name}
      </span>
    </div>
    <div
      aria-label="content"
      css={css`
        padding: 1.2rem;
      `}
    >
      {children}
    </div>
  </Paper>
  ));

Card.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired, // eslint-disable-line
};

export default Card;
