import { useMemo, useContext } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import { getWeekRangeValue, toDateValue } from 'utils/date';
import Context from './Context';
import { YEAR_DISPLAY_COUNT } from './constants';

const useDatePicker = () => {
  const {
    displayType,
    month,
    year,
    value,
    changeYear,
    changeMonth,
    changeValue,
    changeDisplayType,
  } = useContext(Context);

  const isSameValueDate = useMemo(() => value[0].every((d, i) => d === value[1][i]), [value]);

  const yearsList = useMemo(() => {
    const result = [];
    for (let i = 2000; i <= 2099;) {
      result.push(_.times(YEAR_DISPLAY_COUNT).map((j) => i + j));
      i += YEAR_DISPLAY_COUNT;
    }
    return result;
  }, []);

  const valueRange = useMemo(() => {
    if (!isSameValueDate) {
      return value;
    }
    if (displayType === 'week') {
      return getWeekRangeValue(value[0]);
    }
    if (displayType === 'year') {
      return [
        [
          value[0][0],
          0,
          1,
        ],
        [
          value[0][0],
          11,
          31,
        ],
      ];
    }
    const m = dayjs()
      .year(value[0][0])
      .month(value[0][1])
      .startOf('month');
    return [
      toDateValue(m.toDate()),
      toDateValue(m.endOf('month').toDate()),
    ];
  }, [isSameValueDate, value, displayType]);

  return {
    displayType,
    valueRange,
    month,
    year,
    value,
    changeYear,
    changeMonth,
    changeValue,
    changeDisplayType,
    isSameValueDate,
    yearsList,
  };
};

export default useDatePicker;
