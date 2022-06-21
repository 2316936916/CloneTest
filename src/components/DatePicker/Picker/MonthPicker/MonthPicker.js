import {
  useMemo,
  memo,
  useState,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { mapNumberToCNName } from 'utils';
import IconBtn from 'components/IconBtn';

const MonthPicker = memo(({
  currentYear,
  onChange,
}) => {
  const [year, setYear] = useState(currentYear);

  const list = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      result.push({
        _id: `${i}`,
        name: `${mapNumberToCNName(i + 1)}`,
        value: [year, i],
      });
    }
    return result;
  }, [year]);

  return (
    <Fragment>
      <div
        css={css`
            display: grid;
            height: 100%;
            padding: 0 0.6rem;
            grid-template-columns: 1.1rem 1fr 1.1rem;
            grid-column-gap: 0.6rem;
            align-items: center;
        `}
      >
        <IconBtn
          code="eb15"
          css={css`
            width: 1.1rem;
            height: 1.1rem;
          `}
          onClick={() => {
            setYear(year - 1);
          }}
        />
        <div
          css={css`
            font-size: 1.1rem;
            font-weight: bold;
            justify-self: center;
          `}
        >
          <span>
            {`${year}年`}
          </span>
        </div>
        <IconBtn
          css={css`
            width: 1.1rem;
            height: 1.1rem;
          `}
          code="eb16"
          onClick={() => {
            setYear(year + 1);
          }}
        />
      </div>
      <div
        css={css`
          padding: 0.6rem;
          display: grid;
          grid-template-rows: repeat(4, 1fr);
          grid-column-gap: 0.6rem;
          grid-template-columns: repeat(3, 1fr);
          align-items: center;
        `}
        onWheel={(ev) => {
          ev.stopPropagation();
          if (ev.deltaY > 0) {
            setYear(year + 1);
          } else {
            setYear(year - 1);
          }
        }}
      >
        {
          list
            .map((item) => (
              <a
                key={item._id}
                css={css`
                  text-align: center;
                  border-radius: 3px;
                  padding: 0.4rem 0;
                  transition: background 0.3s;
                  &:hover {
                    background: #f0f0f0;
                  }
                `}
                onClick={() => {
                  onChange(item.value);
                }}
              >
                {`${item.name}月`}
              </a>
            ))
        }
      </div>
    </Fragment>
  );
});

MonthPicker.propTypes = {
  currentYear: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MonthPicker;
