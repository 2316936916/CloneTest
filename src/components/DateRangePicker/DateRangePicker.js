import {
  memo,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { toDateValue } from 'utils/date';
import Context from './Context';

const DateRangePicker = memo(({
  children,
  defaultValue = [
    toDateValue(new Date()),
    toDateValue(new Date()),
  ],
  defaultDisplayType = 'month',
}) => {
  const [value, setValue] = useState(defaultValue);
  const [year, setYear] = useState(defaultValue[0][0]);
  const [month, setMonth] = useState(defaultValue[0][1]);
  const [displayType, setDisplayType] = useState(defaultDisplayType);

  const state = useMemo(() => ({
    displayType,
    month,
    year,
    value,
    changeYear: setYear,
    changeMonth: setMonth,
    changeValue: setValue,
    changeDisplayType: setDisplayType,
  }), [
    displayType,
    month,
    year,
    value,
  ]);

  return (
    <Context.Provider
      value={state}
    >
      {children}
    </Context.Provider>
  );
});

DateRangePicker.propTypes = {
  children: PropTypes.element.isRequired,
  defaultValue: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  defaultDisplayType: PropTypes.oneOf([
    'year',
    'month',
    'week',
  ]),
};

export default DateRangePicker;
