import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';
import Icon from 'components/Icon';
import Content from './Content';

const DISPLAY_COUNT = 5;

const TimeRangePicker = memo(({
  value,
  onChange,
  list,
  unit,
}) => {
  const getColor = useColor();

  const update = (dir) => {
    const next = Math.max(Math.min(value + dir, list.length - 1), 0);
    if (!list[next].disabled) {
      onChange(next);
    }
  };

  const btnStyle = css`
    border-width: 0;
    border-radius: 3px;
    background: #e5e5e5;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.4rem;
    &:active {
      background: #e0e0e0;
    }
  `;

  return (
    <div
      css={css`
        padding: 0.4rem 0.6rem;
        display: grid;
        grid-template-rows: 1.3rem auto 1.3rem;
        grid-row-gap: 0.4rem;
        height: 100%;
      `}
    >
      <button
        type="button"
        css={css`
          ${btnStyle}
        `}
        onClick={() => {
          update(-1);
        }}
      >
        <Icon
          code="e79f"
          color="#666"
          css={css`
            width: 1rem;
            height: 1rem;
          `}
        />
      </button>
      <div
        css={css`
          overflow: hidden;
          position: relative;
          height: 100%;
        `}
        onWheel={(ev) => {
          update(ev.deltaY > 0 ? 1 : -1);
        }}
      >
        <div
          css={css`
            height: 100%;
            user-select: none;
            position: relative;
          `}
        >
          <Content
            list={list}
            value={value}
            unit={unit}
            onChange={onChange}
          />
        </div>
        <div
          css={css`
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            border-top: 1px solid ${getColor('a00')};
            border-bottom: 1px solid ${getColor('a00')};
            transform: translateY(-50%);
            pointer-events: none;
          `}
          style={{
            height: `${1 / DISPLAY_COUNT * 100}%`,
          }}
        >
          <span
            css={css`
              position: absolute;
              top: 50%;
              right: 0.4rem;
              transform: translateY(-50%);
              color: ${getColor('a00')};
            `}
          >
            {unit}
          </span>
        </div>
      </div>
      <button
        type="button"
        css={css`
          ${btnStyle}
        `}
        onClick={() => {
          update(1);
        }}
      >
        <Icon
          code="e609"
          color="#666"
          css={css`
            width: 1rem;
            height: 1rem;
          `}
        />
      </button>
    </div>
  );
});

TimeRangePicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
  })).isRequired,
  unit: PropTypes.string.isRequired,
};

export default TimeRangePicker;
