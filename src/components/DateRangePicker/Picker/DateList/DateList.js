import { useMemo, memo } from 'react';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import { toDate } from 'utils/date';
import useDatePicker from '../../useDatePicker';

const DateList = memo(() => {
  const {
    value,
    year,
    month,
    changeValue,
    isSameValueDate,
  } = useDatePicker();
  const list = useMemo(() => {
    const count = dayjs()
      .year(year)
      .month(month)
      .endOf('month')
      .date();
    const result = [];
    const now = dayjs().startOf('day');
    for (let i = 0; i < count; i++) {
      const _value = [year, month, i + 1];
      const m = dayjs(toDate(_value));
      result.push({
        _id: _value.join('/'),
        name: `${i + 1}`,
        value: _value,
        dateName: m.format('YYYY-MM-DD'),
        passed: m.isSameOrBefore(now, 'day'),
      });
    }
    return result;
  }, [year, month]);

  const count = useMemo(() => list.length, [list]);

  if (year !== value[0][0]) {
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
      aria-label="date-picker"
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
      `}
    >
      {
        list
          .map((item) => {
            let isActive = false;
            if (value && isSameValueDate) {
              isActive = value[0].every((d, j) => d === item.value[j]);
            }
            return (
              <button
                data-date-passed={item.passed}
                key={item._id}
                type="button"
                css={css`
                  outline: unset;
                  border: 1px solid #ccc;
                  height: 2.2rem;
                  border-radius: 3px;
                  color: #666;
                  background: #fff;
                  &:active {
                    background: #f0f0f0;
                  }
                `}
                title={item.dateName}
                style={{
                  width: `calc(${(1 / count) * 100}% - 3px)`,
                  color: isActive ? '#598cf6' : null,
                  borderColor: isActive ? '#598cf6' : null,
                  cursor: isActive ? 'Default' : null,
                  fontWeight: isActive ? 'bold' : null,
                }}
                onClick={() => {
                  if (!isActive) {
                    changeValue([
                      item.value,
                      item.value,
                    ]);
                  }
                }}
              >
                {`${item.name}日`}
              </button>
            );
          })
      }
    </div>
  );
});

export default DateList;
