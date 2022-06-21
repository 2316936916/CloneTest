import { memo, useMemo } from 'react';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import IconBtn from 'components/IconBtn';
import useDatePicker from '../../useDatePicker';
import { YEAR_DISPLAY_COUNT } from '../../constants';

const Nav = memo(() => {
  const {
    year,
    month,
    displayType,
    changeYear,
    changeMonth,
    yearsList,
  } = useDatePicker();

  const textDisplay = useMemo(() => {
    if (displayType === 'week') {
      return `${year}年 ${(month + 1).toString().padStart(2, '0')}月`;
    }
    if (displayType === 'month') {
      return `${year}年`;
    }
    const currentYearRange = yearsList.find((arr) => arr.includes(year));
    return `${currentYearRange[0]}年 - ${currentYearRange[YEAR_DISPLAY_COUNT - 1]}年`;
  }, [year, month, displayType, yearsList]);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <IconBtn
        css={css`
          width: 1.1rem;
          height: 1.1rem;
        `}
        code="e875"
        color="#999"
        onClick={() => {
          if (displayType === 'year') {
            const index = yearsList.findIndex((arr) => arr.includes(year));
            if (index !== -1 && yearsList[index - 1]) {
              changeYear(yearsList[index - 1][0]);
            }
          } else if (displayType === 'month') {
            changeYear(year - 1);
          } else {
            const m = dayjs()
              .year(year)
              .month(month)
              .startOf('month')
              .subtract(1, 'day');
            if (m.year() !== year) {
              changeYear(m.year());
            }
            changeMonth(m.month());
          }
        }}
      />
      <div
        css={css`
          font-weight: bold;
          font-size: 1.1rem;
          margin: 0 0.4rem;
        `}
      >
        {textDisplay}
      </div>
      <IconBtn
        css={css`
          width: 1.1rem;
          height: 1.1rem;
        `}
        code="e876"
        color="#999"
        onClick={() => {
          if (displayType === 'year') {
            const index = yearsList.findIndex((arr) => arr.includes(year));
            if (index !== -1 && yearsList[index + 1]) {
              changeYear(yearsList[index + 1][0]);
            }
          } else if (displayType === 'month') {
            changeYear(year + 1);
          } else {
            const m = dayjs()
              .year(year)
              .month(month)
              .endOf('month')
              .add(1, 'day');
            if (m.year() !== year) {
              changeYear(m.year());
            }
            changeMonth(m.month());
          }
        }}
      />
    </div>
  );
});

export default Nav;
