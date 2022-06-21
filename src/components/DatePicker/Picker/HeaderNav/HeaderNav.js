import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';
import IconBtn from 'components/IconBtn';
import {
  DISPLAY_TYPE_MONTH,
  DISPLAY_TYPE_YEAR,
} from '../constants';

const HeaderNav = memo(({
  year,
  month,
  onChangeYear,
  onChangeMonth,
  onChangeDisplayType,
}) => {
  const getColor = useColor();

  return (
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
        code="eb0a"
        css={css`
          width: 1.1rem;
          height: 1.1rem;
        `}
        onClick={() => {
          onChangeYear(year - 1);
        }}
      />
      <IconBtn
        code="eb15"
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
      <div
        css={css`
          font-size: 1.1rem;
          font-weight: bold;
          justify-self: center;
          > a:hover {
            color: ${getColor('a00')};
          }
        `}
      >
        <a
          onClick={() => {
            onChangeDisplayType(DISPLAY_TYPE_YEAR);
          }}
        >
          {`${year}年`}
        </a>
        <a
          css={css`
            margin-left: 0.4rem;
          `}
          onClick={() => {
            onChangeDisplayType(DISPLAY_TYPE_MONTH);
          }}
        >
          {`${(month + 1).toString().padStart(2, '0')}月`}
        </a>
      </div>
      <IconBtn
        css={css`
          width: 1.1rem;
          height: 1.1rem;
        `}
        code="eb16"
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
        code="eb09"
        onClick={() => {
          onChangeYear(year + 1);
        }}
      />
    </div>
  );
});

HeaderNav.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onChangeYear: PropTypes.func.isRequired,
  onChangeMonth: PropTypes.func.isRequired,
  onChangeDisplayType: PropTypes.func.isRequired,
};

export default HeaderNav;
