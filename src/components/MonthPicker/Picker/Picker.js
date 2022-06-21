import {
  useRef,
  useState,
  memo,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import _ from 'lodash';
import useFontSize from 'hooks/useFontSize';
import useZIndex from 'hooks/useZIndex';
import useColor from 'hooks/useColor';
import useRectPosition from 'hooks/useRectPosition';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';

const YEAR_DISPLAY_COUNT = 5;

const MIN_YEAR = 1900;
const MAX_YEAR = 2099;

const yearsList = [];
for (let i = MIN_YEAR; i <= MAX_YEAR;) {
  yearsList.push(_.times(YEAR_DISPLAY_COUNT).map((j) => i + j));
  i += YEAR_DISPLAY_COUNT;
}

const Picker = memo(({
  defaultYear,
  defaultMonth,
  rect,
  onChange,
  onHide,
}) => {
  const fontSize = useFontSize();
  const container = useRef();
  const getColor = useColor();
  const zIndex = useZIndex();
  const containerWidth = fontSize * 24;
  const containerHeight = fontSize * 13;
  const [currentYear, setYear] = useState(defaultYear);
  const [currentMonth, setMonth] = useState(defaultMonth);
  const [index, setIndex] = useState(yearsList.findIndex((arr) => arr.includes(defaultYear)));
  const currentYearList = useMemo(() => yearsList[index], [index]);

  useEffect(() => {
    const handleClick = (ev) => {
      if (!container.current.contains(ev.target)) {
        onHide();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onHide]);

  const [x, y] = useRectPosition(containerWidth, containerHeight, rect);

  return ReactDOM.createPortal(
    (
      <div
        ref={container}
        css={css`
            display: grid;
            padding: 1px;
            background: #ccc;
            grid-template-rows: 3.2rem auto 3.2rem;
            grid-row-gap: 1px;
            position: absolute;
            > * {
              background: #fff;
            }
          `}
        style={{
            width: containerWidth,
            height: containerHeight,
            zIndex,
            left: x,
            top: y,
          }}
      >
        <YearPicker
          list={currentYearList}
          value={currentYear}
          onChange={setYear}
          onNext={() => {
            setIndex(Math.max(Math.min(yearsList.length - 1, index + 1), 0));
          }}
          onPrev={() => {
            setIndex(Math.max(Math.min(yearsList.length - 1, index - 1), 0));
          }}
        />
        <MonthPicker
          value={currentMonth}
          onChange={setMonth}
          onChangeYear={(dir) => {
            const nextYear = Math.max(Math.min(currentYear + dir, MAX_YEAR), MIN_YEAR);
            setYear(nextYear);
            if (!currentYearList.includes(nextYear)) {
              if (nextYear < currentYearList[0]) {
                setIndex(index - 1);
              } else {
                setIndex(index + 1);
              }
            }
          }}
        />
        <div
          css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 0.6rem;
            `}
        >
          <a
            css={css`
              color: ${getColor('a00')};
              &:hover {
                text-decoration: underline;
              }
            `}
            onClick={() => {
              setYear(dayjs().year());
              setMonth(dayjs().month());
              setIndex(yearsList.findIndex((arr) => arr.includes(dayjs().year())));
            }}
          >
            当前
          </a>
          <button
            type="button"
            css={css`
              color: #fff;
              background: ${getColor('a00')};
              border-radius: 3px;
              padding: 0.2rem 0.6rem;
              border-width: 0;
              outline: unset;
            `}
            onClick={() => {
              onChange([currentYear, currentMonth]);
              onHide();
            }}
          >
            确定
          </button>
        </div>
      </div>
    ),
  document.body,
  );
});

Picker.propTypes = {
  rect: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  defaultYear: PropTypes.number.isRequired,
  defaultMonth: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default Picker;
