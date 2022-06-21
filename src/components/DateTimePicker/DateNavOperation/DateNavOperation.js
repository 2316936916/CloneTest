import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import IconBtn from 'components/IconBtn';

const DateNavOperation = memo(({
  year,
  month,
  onChangeYear,
  onChangeMonth,
}) => (
  <div
    css={css`
        display: grid;
        height: 100%;
        padding: 0 0.6rem;
        grid-template-columns: 1.1rem 1.1rem auto 1.1rem 1.1rem;
        grid-column-gap: 0.6rem;
        align-items: center;
    `}
  >
    <IconBtn
      code="e714"
      css={css`
        width: 1.1rem;
        height: 1.1rem;
      `}
      onClick={() => {
        onChangeYear(year - 1);
      }}
    />
    <IconBtn
      code="e745"
      css={css`
        width: 1.1rem;
        height: 1.1rem;
      `}
      onClick={() => {
        if (month === 0) {
          onChangeYear(year - 1);
          onChangeMonth(11);
        } else {
          onChangeMonth(month - 1);
        }
      }}
    />
    <span
      css={css`
        font-size: 1.1rem;
        font-weight: bold;
        justify-self: center;
      `}
    >
      {`${year}年 ${(month + 1).toString().padStart(2, '0')}月`}
    </span>
    <IconBtn
      css={css`
        width: 1.1rem;
        height: 1.1rem;
      `}
      code="e61e"
      onClick={() => {
        if (month === 11) {
          onChangeYear(year + 1);
          onChangeMonth(0);
        } else {
          onChangeMonth(month + 1);
        }
      }}
    />
    <IconBtn
      css={css`
        width: 1.1rem;
        height: 1.1rem;
      `}
      code="e713"
      onClick={() => {
        onChangeYear(year + 1);
      }}
    />
  </div>
  ));

DateNavOperation.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onChangeYear: PropTypes.func.isRequired,
  onChangeMonth: PropTypes.func.isRequired,
};

export default DateNavOperation;
