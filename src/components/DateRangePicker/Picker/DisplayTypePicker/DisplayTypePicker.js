import { memo } from 'react';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import { toDateValue } from 'utils/date';
import useDatePicker from '../../useDatePicker';

const DisplayTypePicker = memo(() => {
  const {
    displayType,
    changeDisplayType,
    changeValue,
    changeMonth,
    month,
    year,
    changeYear,
    value,
    isSameValueDate,
  } = useDatePicker();

  return (
    <div
      aria-label="display-type-picker"
      css={css`
        display: flex;
        > button:not(:first-of-type) {
          margin-left: 0.4rem;
        }
      `}
    >
      {
          [
            {
              value: 'year',
              name: '年',
              onSelect: () => ({
                year,
                month,
                value: [
                  [value[0][0], 0, 1],
                  [value[0][0], 11, 31],
                ],
              }),
            },
            {
              value: 'month',
              name: '月',
              onSelect: () => {
                if (!isSameValueDate) {
                  const m = dayjs();
                  return {
                    year: m.year(),
                    month: m.month(),
                    value: [
                      toDateValue(m.clone().startOf('month').toDate()),
                      toDateValue(m.clone().endOf('month').toDate()),
                    ],
                  };
                }
                return {
                  year: value[0][0],
                  month: value[0][1],
                  value,
                };
              },
            },
            {
              value: 'week',
              name: '周',
              onSelect: () => {
                if (!isSameValueDate) {
                  let m = dayjs();
                  if (m.day() === 0) {
                    m = m.clone().subtract(6, 'day');
                  } else if (m.day() !== 1) {
                    m = m.clone().startOf('week').add(1, 'day');
                  }
                  return {
                    year: m.year(),
                    month: m.month(),
                    value: [
                      toDateValue(m.toDate()),
                      toDateValue(m.clone().add(6, 'day').toDate()),
                    ],
                  };
                }
                return {
                  year: value[0][0],
                  month: value[0][1],
                  value,
                };
              },
            },
          ]
            .map((item) => {
              const isActive = item.value === displayType;
              return (
                <button
                  key={item.value}
                  data-display-type={item.value}
                  type="button"
                  css={css`
                    width: 2.2rem;
                    height: calc(2.2rem - 2px);
                    background: #fff;
                    border: 1px solid #ccc;
                    border-bottom-width: 0;
                    border-radius: 3px 3px 0 0;
                    outline: unset;
                    &:active {
                      background: #f0f0f0;
                    }
                  `}
                  style={{
                    background: isActive ? '#598cf6' : null,
                    color: isActive ? '#fff' : null,
                    borderColor: isActive ? '#598cf6' : null,
                    cursor: isActive ? 'Default' : null,
                  }}
                  onClick={() => {
                    if (!isActive) {
                      const ret = item.onSelect();
                      if (!ret.year !== year) {
                        changeYear(ret.year);
                      }
                      if (!ret.month !== month) {
                        changeMonth(ret.month);
                      }
                      changeValue(ret.value);
                      changeDisplayType(item.value);
                    }
                  }}
                >
                  {item.name}
                </button>
              );
            })
          }
    </div>
  );
});

DisplayTypePicker.propTypes = {
};

export default DisplayTypePicker;
