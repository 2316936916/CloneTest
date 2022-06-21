import React, { useState, useRef } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Field from '../Field';
import IconBtn from '../IconBtn';

const Input = React.memo(({
  value,
  onChange,
  forwardedref,
  onFocus,
  onBlur,
  iconCode,
  onKeyDown,
  clearable = true,
  className,
  ...props
}) => {
  const inputRef = useRef();
  const [isActive, setActive] = useState(false);

  return (
    <Field
      isActive={isActive}
      css={css`
        &:hover {
          button[aria-label=clear-btn] {
            display: inline-block;
          }
        }
      `}
      className={className}
    >
      {
        iconCode && (
          <Icon
            css={css`
              width: 1.4rem;
              height: 1.4rem;
              position: absolute;
              top: 50%;
              left: 0.6rem;
              transform: translateY(-50%);
              pointer-events: none;
            `}
            code={iconCode}
            color="#999"
          />
        )
      }
      <input
        {...props}
        ref={(ref) => {
          inputRef.current = ref;
          if (forwardedref) {
            if (typeof forwardedref === 'function') {
              forwardedref(ref);
            } else {
              forwardedref.current = ref; // eslint-disable-line no-param-reassign
            }
          }
        }}
        css={css`
          height: 100%;
          outline: unset;
          background: rgba(0, 0, 0, 0);
          border-width: 0px;
          padding-left: 0.6rem;
          color: #666;
          padding-right: 0.6rem;
          width: 100%;
        `}
        onChange={(ev) => {
          onChange(ev.target.value);
        }}
        style={{
          paddingLeft: iconCode ? '2.4rem' : null,
        }}
        value={value}
        onKeyDown={onKeyDown}
        onFocus={(ev) => {
          setActive(true);
          if (onFocus) {
            onFocus(ev);
          }
        }}
        onBlur={(ev) => {
          setActive(false);
          if (onBlur) {
            onBlur(ev);
          }
        }}
      />
      {
        clearable && value !== '' && (
          <IconBtn
            onClick={() => {
              onChange('');
            }}
            color="#666"
            aria-label="clear-btn"
            css={css`
              display: none;
              position: absolute;
              top: 50%;
              right: 0.6rem;
              width: 1.2rem;
              height: 1.2rem;
              transform: translateY(-50%);
            `}
            code="e623"
          />
        )
      }
    </Field>
  );
});

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  iconCode: PropTypes.string,
  clearable: PropTypes.bool,
  forwardedref: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  className: PropTypes.string,
};

export default React.forwardRef((props, ref) => (
  <Input
    {...props}
    forwardedref={ref}
  />
));
