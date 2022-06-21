import { memo } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { css } from '@emotion/react';

const FieldItem = memo(({
  name,
  children,
  className,
  style,
  required,
}) => (
  <div
    className={className}
    style={style}
    aria-label="field-item"
  >
    <div
      css={css`
        font-weight: 600;
        margin-bottom: 0.4rem;
      `}
    >
      <span
        css={css`
          cursor: default;
        `}
      >
        {name}
      </span>
      {
        required && (
          <span
            css={css`
              margin-left: 0.2rem;
              color: #f03d3d;
            `}
          >
            *
          </span>
        )
      }
    </div>
    <div>
      {children}
    </div>
  </div>
  ));

FieldItem.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  style: stylePropType,
};

export default FieldItem;
