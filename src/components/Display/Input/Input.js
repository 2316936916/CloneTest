import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
} from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import Icon from 'components/Icon';
import { IconBtn, Field } from 'components/Display';

const Input = React.memo(({
  value,
  onChange,
  clearable: _clearable,
  valid,
  className,
  forwardedref,
  iconCode,
  onKeyDown,
  onBlur,
  onFocus,
  ...props
}) => {
  const [words, setWords] = useState(value);
  const mountedSaved = useRef(true);
  const [isDirty, setDirty] = useState(false);
  const inputRef = useRef();
  const [isActive, setActive] = useState(false);
  const [isEnter, setEnter] = useState(false);
  const clearable = _clearable && !isActive && !!words && isEnter;

  useLayoutEffect(() => {
    mountedSaved.current = true;
    return () => {
      mountedSaved.current = false;
    };
  }, []);

  useEffect(() => {
    if (mountedSaved.current && document.activeElement !== inputRef.current) {
      setWords(value);
    }
  }, [value, setWords, isActive]);

  const invalid = useMemo(() => {
    if (valid == null) {
      return false;
    }
    if (isActive || !isDirty) {
      return false;
    }
    return !valid;
  }, [valid, isActive, isDirty]);

  return (
    <Field
      isActive={isActive}
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
      className={className}
      style={{
        borderColor: invalid ? '#f00' : null,
      }}
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
        aria-label="input"
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
        style={{
          paddingLeft: iconCode ? '2.4rem' : null,
        }}
        onKeyDown={(ev) => {
          if (isHotkey('Enter')(ev)) {
            ev.target.blur();
          }
          if (onKeyDown) {
            onKeyDown(ev);
          }
        }}
        onChange={(ev) => {
          if (!isDirty) {
            setDirty(true);
          }
          setWords(ev.target.value);
        }}
        value={words}
        onFocus={(ev) => {
          setActive(true);
          if (onFocus) {
            onFocus(ev);
          }
        }}
        onBlur={(ev) => {
          if (value !== words) {
            onChange(words);
          }
          setActive(false);
          if (onBlur) {
            onBlur(ev);
          }
        }}
      />
      {
        clearable && (
          <IconBtn
            code="e623"
            css={css`
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0.6rem;
              width: 1.2rem;
              height: 1.2rem;
            `}
            color="#666"
            onMouseDown={(ev) => {
              ev.preventDefault();
              setDirty(false);
              onChange('');
              requestAnimationFrame(() => {
                inputRef.current.focus();
              });
            }}
          />
        )
      }
    </Field>
  );
});

Input.propTypes = {
  valid: PropTypes.bool,
  clearable: PropTypes.bool,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  forwardedref: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  iconCode: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default React.forwardRef((props, ref) => (
  <Input
    {...props}
    forwardedref={ref}
  />
));
