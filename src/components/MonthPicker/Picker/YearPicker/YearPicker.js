import { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColor from 'hooks/useColor';
import IconBtn from 'components/IconBtn';

const YearPicker = memo(({
  value,
  list,
  onChange,
  onPrev,
  onNext,
}) => {
  const getColor = useColor();

  const displayList = useMemo(() => list
    .map((v) => ({
      _id: `${v}`,
      name: `${v}`,
      value: v,
      isActive: value === v,
    })), [list, value]);

  return (
    <div
      css={css`
        display: grid;
        padding: 0 0.6rem;
        grid-template-columns: 1.1rem repeat(${list.length}, 1fr) 1.1rem;
        align-items: center;
        justify-items: center;
      `}
      onWheel={(ev) => {
        ev.stopPropagation();
        if (ev.deltaY > 0) {
          onNext();
        } else {
          onPrev();
        }
      }}
    >
      <IconBtn
        code="e745"
        css={css`
          width: 1.1rem;
          height: 1.1rem;
        `}
        onClick={() => {
          onPrev();
        }}
      />
      {
        displayList
          .map((item) => (
            <a
              key={item._id}
              css={css`
                font-weight: bold;
                font-size: 1.1rem;
              `}
              style={{
                color: item.isActive ? getColor('a00') : null,
                cursor: item.isActive ? 'Default' : null,
              }}
              onClick={() => {
                if (!item.isActive) {
                  onChange(item.value);
                }
              }}
            >
              {item.name}
            </a>
          ))
      }
      <IconBtn
        css={css`
          width: 1.1rem;
          height: 1.1rem;
        `}
        code="e61e"
        onClick={() => {
          onNext();
        }}
      />
    </div>
  );
});

YearPicker.propTypes = {
  value: PropTypes.number.isRequired,
  list: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default YearPicker;
