/* eslint no-param-reassign: 0 */
import {
  memo,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import isHotkey from 'is-hotkey';

const format = ([hour, minute]) => `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

const TimeInput = memo(({
  value,
  onChange,
  startOf,
  endOf,
}) => {
  const [words, setWords] = useState(format(value));
  const [isActive, setActive] = useState(false);

  const valueDisplay = useMemo(() => {
    if (isActive) {
      return words;
    }
    return format(value);
  }, [value, words, isActive]);

  return (
    <input
      css={css`
        text-align: center;
        color: #666;
        border-width: 0;
        outline: unset;
        background: rgba(0, 0, 0, 0);
        align-self: stretch;
        width: 100%;
      `}
      maxLength={5}
      value={valueDisplay}
      onKeyDown={(ev) => {
        if (isHotkey('Enter')(ev)) {
          ev.target.blur();
        }
      }}
      onFocus={() => setActive(true)}
      onChange={(ev) => {
        const v = ev.target.value;
        if (/^\d{3}$/.test(v)) {
          setWords(`${v.slice(0, 2)}:${v.slice(2)}`);
        } else {
          setWords(v);
        }
      }}
      onBlur={(ev) => {
        const matches = ev.target.value.match(/^(\d\d?):(\d\d?)$/);
        if (!matches) {
          setWords(format(value));
        } else {
          const [, hourStr, minuteStr] = matches;
          const h = Number(hourStr);
          const m = Number(minuteStr);
          if (Number.isNaN(h)
            || Number.isNaN(m)
            || h > 23
            || m > 59) {
            setWords(format(value));
          } else {
            const startOfValue = startOf[0] * 60 + startOf[1];
            const endOfValue = endOf[0] * 60 + endOf[1];
            const nextValue = h * 60 + m;
            let next = [h, m];
            if (nextValue < startOfValue) {
              next = startOf;
            } else if (nextValue > endOfValue) {
              next = endOf;
            }
            setWords(format(next));
            if (!(next[0] === value[0] && next[1] === value[1])) {
              onChange(next);
            }
          }
        }
      }}
    />
  );
});

TimeInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  startOf: PropTypes.arrayOf(PropTypes.number).isRequired,
  endOf: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeInput;
