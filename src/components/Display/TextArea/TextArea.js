import React, { useState, useRef } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import Field from '../Field';

const TextArea = React.memo(({
  value,
  onChange,
  className,
  forwardedref,
  ...props
}) => {
  const [words, setWords] = useState(value);
  const inputRef = useRef();
  const [isActive, setActive] = useState(false);

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
        value={isActive ? words : value}
        onFocus={() => {
          setActive(true);
          if (words !== value) {
            setWords(value);
          }
        }}
        onBlur={() => {
          setActive(false);
          onChange(words);
        }}
      />
    </Field>
  );
});

TextArea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  forwardedref: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default React.forwardRef((props, ref) => (
  <TextArea
    {...props}
    forwardedref={ref}
  />
));
