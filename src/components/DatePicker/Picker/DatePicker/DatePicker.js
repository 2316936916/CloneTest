import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';

const DatePicker = memo(({
  list,
  year,
  month,
  onChange,
  onChangeYear,
  onChangeMonth,
  onPick,
}) => {
  const getColor = useColor();

  return (
    <div
      css={css`
        display: grid;
        height: 100%;
        grid-template-columns: repeat(7, 1fr);
        align-items: center;
        justify-items: center;
        padding: 0.4rem 0.6rem;
        user-select: none;
      `}
      style={{
        gridTemplateRows: `repeat(${Math.ceil(list.length / 7) + 1}, 1fr)`,
      }}
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
                  key={item._id}
                  css={css`
                    padding: 0.4rem;
                    border-radius: 3px;
                    background: #f5f5f5;
                    color: rgba(0, 0, 0, 0.25);
                    cursor: not-allowed;
                  `}
                  style={{
                    color: item.isToday ? getColor('a00') : null,
                  }}
                >
                  {item.sortName}
                </span>
              );
            }
            return (
              <a
                key={item._id}
                css={css`
                  padding: 0.4rem 0.6rem;
                  border-radius: 3px;
                  &:hover {
                    background: #f0f0f0;
                  }
                `}
                style={{
                  color: item.isActive ? '#fff' : item.isToday ? getColor('a00') : item.isOtherMonth ? 'rgba(0, 0, 0, 0.25)' : null,
                  background: item.isActive ? getColor('a00') : null,
                  cursor: item.isActive ? 'Default' : null,
                }}
                onDoubleClick={() => {
                  onPick(item.value);
                }}
                onClick={() => {
                  if (!item.isActive) {
                    onChange(item.value);
                  }
                  if (item.isOtherMonth) {
                    onChangeMonth(item.value[1]);
                    if (item.value[0] !== year) {
                      onChangeYear(item.value[0]);
                    }
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
  list: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    sortName: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    isOtherMonth: PropTypes.bool.isRequired,
    value: PropTypes.arrayOf(PropTypes.number),
    isToday: PropTypes.bool.isRequired,
  })).isRequired,
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeYear: PropTypes.func.isRequired,
  onChangeMonth: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
};

export default DatePicker;
