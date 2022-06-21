import {
  useMemo,
  memo,
  useState,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import useColor from 'hooks/useColor';
import useRectPosition from 'hooks/useRectPosition';
import useFontSize from 'hooks/useFontSize';
import useElemRect from 'hooks/useElemRect';
import DatePicker from '../DatePicker';
import DateNavOperation from '../DateNavOperation';
import HourPicker from '../HourPicker';
import MinutePicker from '../MinutePicker';

const Picker = memo(({
  defaultDate,
  defaultHour,
  defaultMinute,
  elem,
  onHide,
  onChange,
  startOf,
  endOf,
}) => {
  const fontSize = useFontSize();
  const container = useRef();
  const [currentHour, setHour] = useState(defaultHour);
  const [currentMinute, setMinute] = useState(defaultMinute);
  const [currentDate, setDate] = useState(defaultDate);
  const getColor = useColor();
  const [currentYear, setCurrentYear] = useState(defaultDate[0]);
  const [currentMonth, setCurrentMonth] = useState(defaultDate[1]);
  const containerWidth = fontSize * 32;
  const containerHeight = fontSize * 24;
  const rect = useElemRect(elem);

  const dateStartOf = useMemo(() => {
    if (!startOf) {
      return null;
    }
    return [startOf[0], startOf[1], startOf[2]];
  }, [startOf]);

  const timeStartOf = useMemo(() => {
    if (!startOf) {
      return null;
    }
    if (currentDate.every((d, i) => d === startOf[i])) {
      return [startOf[3], startOf[4]];
    }
    return null;
  }, [startOf, currentDate]);

  const dateEndOf = useMemo(() => {
    if (!endOf) {
      return null;
    }
    return [endOf[0], endOf[1], endOf[2]];
  }, [endOf]);

  const timeEndOf = useMemo(() => {
    if (!endOf) {
      return null;
    }
    if (currentDate.every((d, i) => d === endOf[i])) {
      return [endOf[3], endOf[4]];
    }
    return null;
  }, [endOf, currentDate]);

  const minuteEndOf = useMemo(() => {
    if (!timeEndOf) {
      return null;
    }
    if (currentHour === endOf[3]) {
      return endOf[4];
    }
    return null;
  }, [timeEndOf, currentHour, endOf]);

  const minuteStartOf = useMemo(() => {
    if (!timeStartOf) {
      return null;
    }
    if (currentHour === startOf[3]) {
      return startOf[4];
    }
    return null;
  }, [timeStartOf, currentHour, startOf]);

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

  return ReactDOM.createPortal(
(
  <div
    css={css`
        padding: 1px;
        background: #ccc;
        position: absolute;
        z-index: 1022;
        display: grid;
        grid-gap: 1px;
        grid-template-rows: 3.2rem auto 3.2rem;
        grid-template-columns: 4fr 1fr 1fr;
        grid-template-areas: 'dateNavHeader dateTimeDisplay dateTimeDisplay' 'datePicker hourPicker minutePicker' 'footer footer footer';
        > div {
          background: #fff;
        }
      `}
    ref={container}
    style={{
        width: containerWidth,
        height: containerHeight,
        left: x,
        top: y,
      }}
  >
    <div
      css={css`
          grid-area: dateNavHeader;
        `}
    >
      <DateNavOperation
        year={currentYear}
        month={currentMonth}
        onChangeMonth={setCurrentMonth}
        onChangeYear={setCurrentYear}
      />
    </div>
    <div
      css={css`
          grid-area: dateTimeDisplay;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: bold;
          > span:not(:first-of-type) {
            margin-left: 0.4rem;
          }
        `}
    >
      <span>
        {
            dayjs()
              .year(currentDate[0])
              .month(currentDate[1])
              .date(currentDate[2])
              .format('YYYY-MM-DD')
          }
      </span>
      <span>
        {`${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`}
      </span>
    </div>
    <div
      css={css`
          grid-area: datePicker;
        `}
    >
      <DatePicker
        value={currentDate}
        year={currentYear}
        month={currentMonth}
        onChangeMonth={setCurrentMonth}
        onChangeYear={setCurrentYear}
        startOf={dateStartOf}
        endOf={dateEndOf}
        onChange={(nextDate) => {
            if (nextDate[1] !== currentMonth) {
              setCurrentMonth(nextDate[1]);
            }
            if (nextDate[0] !== currentYear) {
              setCurrentYear(nextDate[0]);
            }
            setDate(nextDate);
            if (endOf
              && nextDate.every((d, i) => d === endOf[i])
              && currentHour >= endOf[3]
            ) {
              if (currentHour > endOf[3]) {
                setHour(endOf[3]);
                setMinute(endOf[4]);
              } else if (currentMinute > endOf[4]) {
                setMinute(endOf[4]);
              }
            } else if (startOf
              && nextDate.every((d, i) => d === startOf[i])
              && currentHour <= startOf[3]) {
              if (currentHour < startOf[3]) {
                setHour(startOf[3]);
                setMinute(startOf[4]);
              } else if (currentMinute < startOf[4]) {
                setMinute(startOf[4]);
              }
            }
          }}
      />
    </div>
    <div
      css={css`
          grid-area: hourPicker;
        `}
    >
      <HourPicker
        value={currentHour}
        onChange={(nextHour) => {
            setHour(nextHour);
            if (timeEndOf && timeEndOf[0] === nextHour && currentMinute > timeEndOf[1]) {
              setMinute(timeEndOf[1]);
            } else if (timeStartOf && timeStartOf[0] === nextHour && currentMinute < timeStartOf[1]) {
              setMinute(timeStartOf[1]);
            }
          }}
        endOf={timeEndOf ? timeEndOf[0] : null}
        startOf={timeStartOf ? timeStartOf[0] : null}
      />
    </div>
    <div
      css={css`
          grid-area: minutePicker;
        `}
    >
      <MinutePicker
        value={currentMinute}
        onChange={setMinute}
        endOf={minuteEndOf}
        startOf={minuteStartOf}
      />
    </div>
    <div
      css={css`
          grid-area: footer;
          height: 100%;
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
            let now = dayjs();
            if (startOf) {
              const m = dayjs()
                .year(startOf[0])
                .month(startOf[1])
                .date(startOf[2])
                .hour(startOf[3])
                .minute(startOf[4]);
              if (now.isBefore(m, 'minute')) {
                now = m;
              }
            }
            if (endOf) {
              const m = dayjs()
                .year(endOf[0])
                .month(endOf[1])
                .date(endOf[2])
                .hour(endOf[3])
                .minute(endOf[4]);
              if (now.isAfter(m, 'minute')) {
                now = m;
              }
            }
            setCurrentYear(now.year());
            setCurrentMonth(now.month());
            setDate([now.year(), now.month(), now.date()]);
            setHour(now.hour());
            setMinute(now.minute());
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
            onChange([...currentDate, currentHour, currentMinute]);
            onHide();
          }}
      >
        确定
      </button>
    </div>
  </div>
  ), document.body,
);
});

Picker.propTypes = {
  elem: PropTypes.instanceOf(Element).isRequired,
  defaultDate: PropTypes.arrayOf(PropTypes.number).isRequired,
  defaultHour: PropTypes.number.isRequired,
  defaultMinute: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  startOf: PropTypes.arrayOf(PropTypes.number),
  endOf: PropTypes.arrayOf(PropTypes.number),
};

export default Picker;
