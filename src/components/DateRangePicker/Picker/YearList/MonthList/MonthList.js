import { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import dayjs from 'dayjs';

const MonthList = memo(({
  yearList,
  value,
  onChange,
}) => {
  const currentYear = useMemo(() => yearList.find((d) => d.value === value[0][0]), [yearList, value]);

  const list = useMemo(() => {
    if (!currentYear) {
      return [];
    }
    const result = [];
    const month = dayjs().month();
    const year = dayjs().year();
    for (let i = 0; i < 12; i++) {
      result.push({
        _id: `${i}`,
        name: `${i + 1}`,
        value: i,
        passed: currentYear.value === year ? month >= i : currentYear.value < year,
      });
    }
    return result;
  }, [currentYear]);

  if (!currentYear) {
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
              isActive = value[0][1] === value[1][1] && value[0][1] === item.value;
            }
            return (
              <button
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
                data-month-passed={item.passed}
                style={{
                  color: isActive ? '#598cf6' : null,
                  borderColor: isActive ? '#598cf6' : null,
                  fontWeight: isActive ? 'bold' : null,
                }}
                onClick={() => {
                  if (!isActive) {
                    onChange([
                      [
                        currentYear.value,
                        item.value,
                        1,
                      ],
                      [
                        currentYear.value,
                        item.value,
                        dayjs()
                          .year(currentYear.value)
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
  );
});

MonthList.propTypes = {
  yearList: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  value: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MonthList;
