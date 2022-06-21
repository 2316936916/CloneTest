/* eslint react/no-array-index-key: 0 */
import { memo, Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';
import Icon from 'components/Icon';
import IconBtn from 'components/IconBtn';
import TimeInput from './TimeInput';

const calcNextValue = (pre) => (pre[1] === 59 ? [pre[0] + 1, 0] : [pre[0], pre[1] + 1]);

const calcNextPrev = (next) => (next[1] === 0 ? [next[0] - 1, 59] : [next[0], next[1] - 1]);

const TimeRangesInput = memo(({
  value,
  onChange,
}) => {
  const getColor = useColor();
  const last = useMemo(() => {
    if (value.length === 0) {
      return null;
    }
    return value[value.length - 1][1];
  }, [value]);

  return (
    <Fragment>
      {
        value
          .map((range, i) => (
            <div
              key={`${value.length}_${i}`}
              css={css`
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: center;
                border: 1px solid #ccc;
                border-radius: 3px;
                height: 2.2rem;
                background: #fff;
                position: relative;
              `}
            >
              <TimeInput
                value={range[0]}
                startOf={i === 0 ? [0, 0] : calcNextValue(value[i - 1][1])}
                endOf={range[1]}
                onChange={(v) => {
                    onChange([
                      ...value.slice(0, i),
                      [v, range[1]],
                      ...value.slice(i + 1),
                    ]);
                  }}
              />
              <span>
                -
              </span>
              <TimeInput
                value={range[1]}
                startOf={range[0]}
                endOf={i < value.length - 1 ? calcNextPrev(value[i + 1][0]) : [23, 59]}
                onChange={(v) => {
                    onChange([
                      ...value.slice(0, i),
                      [range[0], v],
                      ...value.slice(i + 1),
                    ]);
                  }}
              />
              <IconBtn
                code="e623"
                color={getColor('a02')}
                css={css`
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 1.2rem;
                  height: 1.2rem;
                  transform: translate(50%, -50%);
                `}
                onClick={() => {
                  onChange([...value.slice(0, i), ...value.slice(i + 1)]);
                }}
              />
            </div>
            ))
      }
      {
        (!last || !(last[0] === 23 && last[1] === 59)) && (
          <a
            css={css`
              height: 2.2rem;
              border: 1px solid #ccc;
              border-radius: 3px;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
            aria-label="append-btn"
            onClick={() => {
              if (last != null) {
                onChange([
                  ...value,
                  [
                    calcNextValue(last),
                    [23, 59],
                  ],
                ]);
              } else {
                onChange([
                  [
                    [0, 0],
                    [23, 59],
                  ],
                ]);
              }
            }}
          >
            <Icon
              css={css`
                width: 1.2rem;
                height: 1.2rem;
              `}
              code="e608"
              color={getColor('a00')}
            />
          </a>
        )
      }
    </Fragment>
  );
});

TimeRangesInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeRangesInput;
