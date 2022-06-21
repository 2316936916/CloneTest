import { useMemo, memo } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import useColor from 'hooks/useColor';
import { isBefore, isAfter } from 'utils/date';

const DatePicker = memo(({
  year,
  month,
  value,
  onChange,
  onChangeMonth,
  onChangeYear,
  startOf,
  endOf,
}) => {
  const getColor = useColor();
  const list = useMemo(() => {
    const current = dayjs().year(year).month(month);
    const today = new Date();
    const startDay = current.clone().startOf('month').startOf('week');
    const endDay = current.clone().endOf('month').endOf('week');
    let len = endDay.diff(startDay, 'day');
    if ((len + 1) / 7 < 6) {
      len = (6 - (len + 1) / 7) * 7 + len;
    }
    const result = [];
    for (let i = 0; i <= len; i++) {
      const d = startDay.clone().add(i, 'day');
      const dateValue = [d.year(), d.month(), d.date()];
      result.push({
        isOtherMonth: !d.isSame(current, 'month'),
        id: d.format('YYYY/MM/DD'),
        value: dateValue,
        name: d.format('YYYY-MM-DD'),
        sortName: d.format('DD'),
        isToday: d.isSame(today, 'day'),
        isActive: value && value.every((v, j) => v === dateValue[j]),
        disabled: (!!startOf && isBefore(dateValue, startOf))
          || !!endOf && isAfter(dateValue, endOf),
      });
    }
    return result;
  }, [
    year,
    month,
    value,
    startOf,
    endOf,
  ]);

  return (
    <div
      css={css`
        height: 100%;
        padding: 0.4rem 0.6rem;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(7, 1fr);
        align-items: center;
        justify-items: center;
      `}
      onWheel={(ev) => {
        ev.stopPropagation();
        if (ev.deltaY > 0) {
          if (month === 11) {
            onChangeYear(year + 1);
            onChangeMonth(0);
          } else {
            onChangeMonth(month + 1);
          }
        } else if (month === 0) {
          onChangeYear(year - 1);
          onChangeMonth(11);
        } else {
          onChangeMonth(month - 1);
        }
      }}
    >
      {
        '日一二三四五六'
          .split('')
          .map((weekName) => (
            <span
              key={weekName}
            >
              {weekName}
            </span>
          ))
      }
      {
        list
          .map((item) => {
            if (item.disabled) {
              return (
                <span
                  key={item.id}
                  css={css`
                    padding: 0.4rem;
                    border-radius: 3px;
                    background: #f5f5f5;
                    color: rgba(0, 0, 0, 0.25);
                    cursor: not-allowed;
                  `}
                >
                  {item.sortName}
                </span>
              );
            }
            return (
              <a
                key={item.id}
                css={css`
                  padding: 0.4rem 0.6rem;
                  border-radius: 3px;
                  &:hover {
                    background: #f0f0f0;
                  }
                `}
                style={{
                  color: item.isActive ? '#fff' : item.isOtherMonth ? 'rgba(0, 0, 0, 0.25)' : null,
                  background: item.isActive ? getColor('a00') : null,
                  cursor: item.isActive ? 'Default' : null,
                }}
                onClick={() => {
                  if (!item.isActive) {
                    onChange(item.value);
                  }
                }}
              >
                {item.sortName}
              </a>
            );
          })
      }
    </div>
  );
});

DatePicker.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  value: PropTypes.arrayOf(PropTypes.number),
  startOf: PropTypes.arrayOf(PropTypes.number),
  endOf: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  onChangeMonth: PropTypes.func.isRequired,
  onChangeYear: PropTypes.func.isRequired,
};

export default DatePicker;
