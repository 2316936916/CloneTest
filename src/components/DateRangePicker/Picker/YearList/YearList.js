import { Fragment, useMemo, memo } from 'react';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import useDatePicker from '../../useDatePicker';
import MonthList from './MonthList';

const YearList = memo(() => {
  const {
    value,
    changeValue,
    year,
    yearsList,
  } = useDatePicker();

  const yearList = useMemo(() => {
    const currentYear = dayjs().year();
    return yearsList
      .find((arr) => arr.includes(year))
      .map((v) => ({
        _id: `${v}`,
        name: `${v}`,
        value: v,
        passed: v <= currentYear,
      }));
  }, [yearsList, year]);

  return (
    <Fragment>
      <div
        aria-label="year-picker"
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        {
          yearList
            .map((item) => {
              let isActive = false;
              if (value) {
                isActive = value[0][0] === item.value;
              }

              return (
                <button
                  key={item._id}
                  type="button"
                  data-year-passed={item.passed}
                  css={css`
                    outline: unset;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    color: #666;
                    background: #fff;
                    height: 2.2rem;
                    &:active {
                      background: #f0f0f0;
                    }
                  `}
                  style={{
                    background: isActive ? '#598cf6' : null,
                    borderColor: isActive ? '#598cf6' : null,
                    color: isActive ? '#fff' : null,
                    width: `calc(${(1 / yearList.length) * 100}% - 3px)`,
                    fontWeight: isActive ? 'bold' : null,
                  }}
                  onClick={() => {
                    if (!isActive || value[0][1] === value[1][1]) {
                      changeValue([
                        [item.value, 0, 1],
                        [item.value, 11, 31],
                      ]);
                    }
                  }}
                >
                  {`${item.name}年`}
                </button>
              );
            })
        }
      </div>
      <MonthList
        yearList={yearList}
        onChange={changeValue}
        value={value}
      />
    </Fragment>
  );
});

export default YearList;
