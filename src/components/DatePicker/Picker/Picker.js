import {
  memo,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { jsx as _jsx } from 'react/jsx-runtime';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import useZIndex from 'hooks/useZIndex';
import useColor from 'hooks/useColor';
import useFontSize from 'hooks/useFontSize';
import useElemRect from 'hooks/useElemRect';
import useRectPosition from 'hooks/useRectPosition';
import {
  isSame,
  isBefore,
  isAfter,
  toDateValue,
} from 'utils/date';
import {
  DISPLAY_TYPE_DAY,
  DISPLAY_TYPE_MONTH,
  DISPLAY_TYPE_YEAR,
} from './constants';
import DatePicker from './DatePicker';
import HeaderNav from './HeaderNav';
import YearPicker from './YearPicker';
import MonthPicker from './MonthPicker';

const Picker = memo(({
  value,
  startOf,
  endOf,
  elem,
  onChange,
  onHide,
}) => {
  const [displayType, setDisplayType] = useState(DISPLAY_TYPE_DAY);
  const fontSize = useFontSize();
  const rect = useElemRect(elem);
  const zIndex = useZIndex();
  const container = useRef();
  const getColor = useColor();
  const [currentYear, setCurrentYear] = useState(value ? value[0] : dayjs().year());
  const [currentMonth, setCurrentMonth] = useState(value ? value[1] : dayjs().month());
  const [dateValue, setDateValue] = useState(value || toDateValue(new Date()));

  const dateList = useMemo(() => {
    const current = dayjs().year(currentYear).month(currentMonth);
    const today = new Date();
    const startDay = current.clone().startOf('month').startOf('week');
    const endDay = current.clone().endOf('month').endOf('week');
    const len = endDay.diff(startDay, 'day');
    const result = [];
    for (let i = 0; i <= len; i++) {
      const d = startDay.clone().add(i, 'day');
      const v = [d.year(), d.month(), d.date()];
      result.push({
        isOtherMonth: !d.isSame(current, 'month'),
        _id: d.format('YYYY/MM/DD'),
        value: v,
        name: d.format('YYYY-MM-DD'),
        sortName: d.format('DD'),
        isActive: isSame(dateValue, v),
        isToday: d.isSame(today, 'day'),
        disabled: (!!startOf && isBefore(v, startOf))
          || !!endOf && isAfter(v, endOf),
      });
    }
    return result;
  }, [
    dateValue,
    currentYear,
    currentMonth,
    startOf,
    endOf,
  ]);

  const itemHeight = fontSize * 3.2;
  const rowSize = Math.ceil(dateList.length / 7);

  const containerWidth = fontSize * 22;
  const containerHeight = DISPLAY_TYPE_DAY === displayType ? Math.ceil(rowSize * itemHeight + fontSize * 3.2 * 2 + 4) : fontSize * 3.2 * 6;

  const [x, y] = useRectPosition(containerWidth, containerHeight, rect);

  useEffect(() => {
    const handleClick = (ev) => {
      if (!elem.contains(ev.target) && !container.current.contains(ev.target)) {
        onHide();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onHide, elem]);

  const viewDisplayMap = {
    [DISPLAY_TYPE_DAY]: {
      component: DatePicker,
      props: {
        list: dateList,
        year: currentYear,
        month: currentMonth,
        onChangeYear: setCurrentYear,
        onChangeMonth: setCurrentMonth,
        onChange: (v) => {
          setDateValue(v);
        },
        onPick: (v) => {
          if (!value || !isSame(value, v)) {
            onChange(dateValue);
          }
          onHide();
        },
      },
    },
    [DISPLAY_TYPE_MONTH]: {
      component: MonthPicker,
      props: {
        currentYear,
        onChange: (v) => {
          setCurrentYear(v[0]);
          setCurrentMonth(v[1]);
          setDisplayType(DISPLAY_TYPE_DAY);
        },
      },
    },
    [DISPLAY_TYPE_YEAR]: {
      component: YearPicker,
      props: {
        currentYear,
        onChange: (v) => {
          setCurrentYear(v);
          setDisplayType(DISPLAY_TYPE_DAY);
        },
      },
    },
  };

  return ReactDOM.createPortal(
  (
    <div
      ref={container}
      css={css`
          position: absolute;
          padding: 1px;
          background: #ccc;
          display: grid;
          grid-gap: 1px;
          > div {
            background: #fff;
          }
        `}
      style={{
          width: containerWidth,
          height: containerHeight,
          gridTemplateRows: displayType === DISPLAY_TYPE_DAY ? '3.2rem 1fr 3.2rem' : '3.2rem 1fr',
          zIndex,
          left: x,
          top: y,
        }}
    >
      {
          displayType === DISPLAY_TYPE_DAY && (
            <HeaderNav
              year={currentYear}
              month={currentMonth}
              onChangeYear={setCurrentYear}
              onChangeMonth={setCurrentMonth}
              displayType={displayType}
              onChangeDisplayType={setDisplayType}
            />
          )
        }
      {
          _jsx(viewDisplayMap[displayType].component, {
            ...viewDisplayMap[displayType].props,
          })
        }
      {
          displayType === DISPLAY_TYPE_DAY && (
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
                  let current = toDateValue(new Date());
                  if (startOf && isAfter(current, startOf)) {
                    current = startOf;
                  }
                  if (endOf && isBefore(current, endOf)) {
                    current = endOf;
                  }
                  if (!value || !isSame(current, value)) {
                    onChange(current);
                  }
                  onHide();
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
                  if (!value || !isSame(value, dateValue)) {
                    onChange(dateValue);
                  }
                  onHide();
                }}
              >
                确定
              </button>
            </div>
          )
        }
    </div>
  ),
  document.body,
);
});

Picker.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  startOf: PropTypes.arrayOf(PropTypes.number),
  elem: PropTypes.instanceOf(Element).isRequired,
  endOf: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default Picker;
