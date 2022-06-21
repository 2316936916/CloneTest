import React, {
  memo,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import Field from 'components/Field';

const Textarea = memo(({
  value,
  onChange,
  className,
  forwardedref,
  onBlur,
  onFocus,
  ...props
}) => {
  const [words, setWords] = useState(value);
  const inputRef = useRef();
  const mountedSaved = useRef(true);
  const [isActive, setActive] = useState(false);

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

  return (
    <Field
      isActive={isActive}
      css={css`
        height: 6.8rem;
      `}
      className={className}
    >
      <textarea
        {...props}
        ref={inputRef}
        css={css`
          height: 100%;
          width: 100%;
          display: block;
          outline: unset;
          color: #666;
          background: rgba(0, 0, 0, 0);
          border-width: 0px;
          padding: 0.6rem;
          resize: none;
        `}
        spellCheck={false}
        onChange={(ev) => {
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
    </Field>
  );
});

Textarea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  forwardedref: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default React.forwardRef((props, ref) => (
  <Textarea
    {...props}
    forwardedref={ref}
  />
));
