import { memo, useState, useRef } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Field from 'components/Field';
import IconBtn from 'components/IconBtn';

const InputSync = memo(({
  value,
  onChange,
  onFocus,
  onBlur,
  iconCode,
  onKeyDown,
  clearable = true,
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
        ref={inputRef}
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

InputSync.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  iconCode: PropTypes.string,
  clearable: PropTypes.bool,
};

export default InputSync;
