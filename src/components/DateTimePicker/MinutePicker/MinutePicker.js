import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Picker from '../TimeRangePicker';

const MinutePicker = memo(({
  value,
  startOf,
  endOf,
  onChange,
}) => {
  const list = useMemo(() => {
    const result = [];
    for (let i = 0; i < 60; i++) {
      let disabled = false;
      if (startOf != null) {
        disabled = i < startOf;
      }
      if (endOf != null && !disabled) {
        disabled = i > endOf;
      }
      result.push({
        id: `${i}`,
        value: i,
        name: `${i}`,
        disabled,
      });
    }
    return result;
  }, [endOf, startOf]);

  return (
    <Picker
      list={list}
      onChange={onChange}
      value={value}
      unit="分"
    />
  );
});

MinutePicker.propTypes = {
  value: PropTypes.number.isRequired,
  startOf: PropTypes.number,
  endOf: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default MinutePicker;
