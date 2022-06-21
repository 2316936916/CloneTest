import React, {
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';
import IconBtn from 'components/Display/IconBtn';

const SearchInput = React.memo(({
  value,
  onChange,
  placeholder,
}) => {
  const inputRef = useRef();
  const [isActive, setActive] = useState(false);
  const getColor = useColor();
  return (
    <div
      css={css`
        display: flex;
        background: #fff;
        position: relative;
        padding: 0 0.4rem;
        height: 2.6rem;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 2px;
        transition: border-color 0.3s;
        &:hover {
          button[aria-label=clear-btn] {
            display: inline-block;
          }
        }
      `}
      style={{
        borderColor: isActive ? getColor('a00') : null,
      }}
    >
      {/* <IconBtn
        css={css`
          width: 1.4rem;
          height: 1.4rem;
        `}
        code="e653"
        onClick={() => {
          inputRef.current.focus();
        }}
      /> */}
      <input
        ref={inputRef}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        placeholder={placeholder}
        css={css`
          height: 100%;
          width: calc(100%);
          margin-left: 0.3rem;
          border-width: 0;
          outline: unset;
          background: rgba(0, 0, 0, 0);
          color: #666;
          padding-right: 1.8rem;
        `}
      />
      {
        value !== '' && (
          <IconBtn
            onClick={() => {
              inputRef.current.focus();
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
            code="e630"
          />
        )
      }
    </div>
  );
});

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchInput;
