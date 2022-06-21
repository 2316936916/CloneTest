import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import {
  toDateValue,
  isSame,
  toDate,
  inRange,
} from 'utils/date';
import useDatePicker from '../../useDatePicker';

const weekNames = '一二三四五六日';

const DayList = memo(({
  weekList,
}) => {
  const {
    value,
    changeValue,
    isSameValueDate,
  } = useDatePicker();
  const currentWeek = useMemo(() => {
    if (!value) {
      return null;
    }
    if (isSameValueDate) {
      return weekList.find((d) => inRange(value[0], d.value));
    }
    return weekList.find((d) => isSame(d.value, value));
  }, [weekList, value, isSameValueDate]);

  const dateList = useMemo(() => {
    if (!currentWeek) {
      return [];
    }
    const m = dayjs(toDate(currentWeek.value[0])).startOf('day');
    const result = [];
    const now = dayjs().startOf('day');
    for (let i = 0; i < 7; i++) {
      const mm = m.clone().add(i, 'day');
      const _value = toDateValue(mm.toDate());
      result.push({
        _id: _value.join('/'),
        name: `${weekNames[i]}`,
        dateName: mm.format('MM月DD日'),
        value: _value,
        passed: mm.isSameOrBefore(now),
      });
    }
    return result;
  }, [currentWeek]);

  if (dateList.length === 0) {
    return (
      <div
        css={css`
          height: 2.2rem;
        `}
      />
    );
  }

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 3px;
      `}
      aria-label="day-picker"
    >
      {
        dateList
          .map((item) => {
            const isActive = value ? item.value.every((d, j) => d === value[0][j] && d === value[1][j]) : false;
            return (
              <button
                data-day-passed={item.passed}
                css={css`
                  outline: unset;
                  border: 1px solid #ccc;
                  border-radius: 3px;
                  color: #666;
                  background: #fff;
                  height: 2.2rem;
                  width: calc(${(1 / 7) * 100}% - 3px);
                  &:active {
                    background: #f0f0f0;
                  }
                `}
                key={item._id}
                type="button"
                style={{
                  cursor: isActive ? 'Default' : null,
                  borderColor: isActive ? '#598cf6' : null,
                  color: isActive ? '#598cf6' : null,
                }}
                onClick={() => {
                  if (!isActive) {
                    changeValue([item.value, item.value]);
                  }
                }}
              >
                <span
                  css={css`
                    font-weight: bold;
                  `}
                >
                  {`周${item.name}`}
                </span>
                <span
                  css={css`
                    margin-left: 0.4rem;
                  `}
                >
                  {item.dateName}
                </span>
              </button>
            );
          })
      }
    </div>
  );
});

DayList.propTypes = {
  weekList: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  })).isRequired,
};

export default DayList;
