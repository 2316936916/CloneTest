import { useMemo, memo, Fragment } from 'react';
import dayjs from 'dayjs';
import { css } from '@emotion/react';
import { stringify, isSame, inRange } from 'utils/date';
import useDatePicker from '../../useDatePicker';
import DayList from '../DayList';

const WeekList = memo(() => {
  const {
    value,
    changeValue,
    isSameValueDate,
    year,
    month,
  } = useDatePicker();

  const weekList = useMemo(() => {
    let start = dayjs()
      .year(year)
      .month(month)
      .startOf('month');
    if (start.day() !== 1) {
      if (start.day() === 0) {
        start = start.clone().subtract(6, 'day');
      } else {
        start = start.clone().startOf('week').add(1, 'day');
      }
    }
    let current = start.clone();
    const result = [];
    const now = dayjs().startOf('day');
    const end = dayjs()
      .year(year)
      .month(month)
      .endOf('month')
      .startOf('day');
    while (current.month() === month || current.isSameOrBefore(end, 'day')) {
      const last = current.clone().add(6, 'day');
      const _value = [
          [
            current.year(), current.month(), current.date(),
          ],
          [
            last.year(), last.month(), last.date(),
          ],
      ];
      result.push({
        _id: stringify(_value),
        value: _value,
        month: current.month(),
        name: `${current.format('MM月DD日')} ~ ${last.format('MM月DD日')}`,
        passed: current.isSameOrBefore(now, 'day'),
      });
      current = current.clone().add(7, 'day');
    }
    return result;
  }, [year, month]);

  const count = useMemo(() => weekList.length, [weekList]);

  return (
    <Fragment>
      <div
        aria-label="week-picker"
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        {
          weekList
            .map((item, i) => {
              let isActive = false;
              if (value) {
                isActive = isSameValueDate ? inRange(value[0], item.value) : isSame(item.value, value);
              }

              return (
                <button
                  data-week-passed={item.passed}
                  data-week-month={item.month}
                  css={css`
                    outline: unset;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    color: #666;
                    background: #fff;
                    height: 2.2rem;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    &:active {
                      background: #f0f0f0;
                    }
                  `}
                  key={item._id}
                  type="button"
                  style={{
                    width: `calc(${(1 / count) * 100}% - 3px)`,
                    borderColor: isActive ? '#598cf6' : null,
                    color: isActive ? '#598cf6' : null,
                  }}
                  onClick={() => {
                    if (!isActive || isSame(value[0], value[1])) {
                      changeValue(item.value);
                    }
                  }}
                >
                  <span
                    css={css`
                      background: #ccc;
                      color: #fff;
                      font-weight: bold;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 1.8rem;
                      height: 100%;
                    `}
                    style={{
                      background: isActive ? '#598cf6' : null,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    css={css`
                      flex-grow: 1;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100%;
                    `}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })
        }
      </div>
      <DayList
        weekList={weekList}
      />
    </Fragment>
  );
});

WeekList.propTypes = {
};

export default WeekList;
