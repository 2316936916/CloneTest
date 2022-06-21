import { memo } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { css } from '@emotion/react';
import useDatePicker from '../useDatePicker';
import MonthList from './MonthList';
import WeekList from './WeekList';
import YearList from './YearList';
import Nav from './Nav';
import DisplayTypePicker from './DisplayTypePicker';

const Picker = memo(({
  className,
  style,
}) => {
  const {
    displayType,
  } = useDatePicker();

  return (
    <div
      className={className}
      style={style}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          height: 3.2rem;
        `}
      >
        <Nav />
        <div
          css={css`
            position: absolute;
            z-index: 2;
            bottom: 0;
            left: 0.6rem;
          `}
        >
          <DisplayTypePicker />
        </div>
      </div>
      <div
        css={css`
          background: #fff;
          border-radius: 3px;
          padding: 0.6rem;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
          > div:not(:last-of-type) {
            margin-bottom: 3px;
          }
        `}
      >
        {
          displayType === 'month' && (
            <MonthList />
          )
        }
        {
          displayType === 'week' && (
            <WeekList />
          )
        }
        {
          displayType === 'year' && (
            <YearList />
          )
        }
      </div>
    </div>
  );
});

Picker.propTypes = {
  className: PropTypes.string,
  style: stylePropType,
};

export default Picker;
