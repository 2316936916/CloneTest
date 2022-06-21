import { Fragment, memo, useMemo } from 'react';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import useDatePicker from '../../useDatePicker';
import DateList from '../DateList';

const MonthList = memo(() => {
  const {
    year,
    value,
    changeValue,
    changeMonth,
    isSameValueDate,
  } = useDatePicker();

  const list = useMemo(() => {
    const result = [];
    const m = dayjs();
    const currentYear = m.year();
    const currentMonth = m.month();
    for (let i = 0; i < 12; i++) {
      result.push({
        _id: `${i}`,
        value: i,
        passed: currentYear === year ? currentMonth >= i : currentYear > year,
        name: `${i + 1}`,
      });
    }
    return result;
  }, [year]);

  return (
    <Fragment>
      <div
        aria-label="month-picker"
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          > button {
            width: calc(${(1 / 12) * 100}% - 3px);
          }
        `}
      >
        {
          list
            .map((item) => {
              let isActive = false;
              if (value) {
                isActive = value[0][0] === year && value[0][1] === item.value;
              }
              return (
                <button
                  key={item._id}
                  type="button"
                  data-month-passed={item.passed}
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
                  style={{
                    background: isActive ? '#598cf6' : null,
                    color: isActive ? '#fff' : null,
                    borderColor: isActive ? '#598cf6' : null,
                    fontWeight: isActive ? 'bold' : null,
                  }}
                  onClick={() => {
                    changeMonth(item.value);
                    if (!isActive || isSameValueDate) {
                      changeValue([
                        [year, item.value, 1],
                        [
                          year,
                          item.value,
                          dayjs()
                          .year(year)
                          .month(item.value)
                          .endOf('month')
                          .date(),
                        ],
                      ]);
                    }
                  }}
                >
                  {`${item.name}月`}
                </button>
              );
            })
        }
      </div>
      <DateList />
    </Fragment>
  );
});

MonthList.propTypes = {
};

export default MonthList;
