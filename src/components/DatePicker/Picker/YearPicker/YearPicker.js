import {
  useMemo,
  useState,
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import _ from 'lodash';
import IconBtn from 'components/IconBtn';

const YearPicker = memo(({
  currentYear,
  onChange,
}) => {
  const [startOf, setStartOf] = useState(currentYear);

  const list = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      const v = startOf + i;
      result.push({
        _id: `${v}`,
        value: v,
        name: `${v}`,
      });
    }
    return result;
  }, [startOf]);

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
            setStartOf(startOf - 12);
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
            {`${_.first(list).name}-${_.last(list).name}`}
          </span>
        </div>
        <IconBtn
          css={css`
            width: 1.1rem;
            height: 1.1rem;
          `}
          code="eb16"
          onClick={() => {
            setStartOf(startOf + 12);
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
            setStartOf(startOf + 12);
          } else {
            setStartOf(startOf - 12);
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
                {`${item.name}`}
              </a>
            ))
        }
      </div>
    </Fragment>
  );
});

YearPicker.propTypes = {
  currentYear: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default YearPicker;
