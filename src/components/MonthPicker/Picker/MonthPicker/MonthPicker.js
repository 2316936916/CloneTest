import { useMemo, memo } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import useColor from 'hooks/useColor';

const MonthPicker = memo(({
  value,
  onChange,
  onChangeYear,
}) => {
  const getColor = useColor();
  const list = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      result.push({
        _id: `${i}`,
        name: `${i + 1}`.padStart(2, '0'),
        value: i,
        isActive: value === i,
      });
    }
    return result;
  }, [value]);

  return (
    <div
      css={css`
        padding: 0.4rem 0.6rem;
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: repeat(6, 1fr);
        align-items: center;
        justify-items: center;
      `}
      onWheel={(ev) => {
        ev.stopPropagation();
        if (ev.deltaY > 0) {
          onChangeYear(1);
        } else {
          onChangeYear(-1);
        }
      }}
    >
      {
        list
          .map((item) => (
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
                color: item.isActive ? '#fff' : null,
                background: item.isActive ? getColor('a00') : null,
                cursor: item.isActive ? 'Default' : null,
              }}
              onClick={() => {
                if (!item.isActive) {
                  onChange(item.value);
                }
              }}
            >
              {`${item.name}月`}
            </a>
          ))
      }
    </div>
  );
});

MonthPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeYear: PropTypes.func.isRequired,
};

export default MonthPicker;
