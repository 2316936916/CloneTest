import {
  memo,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import _ from 'lodash';
import useFontSize from 'hooks/useFontSize';

const DISPLAY_COUNT = 5;

const Content = memo(({
  list,
  value,
  onChange,
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const pointerSaved = useRef();
  const fontSize = useFontSize();
  const currentIndex = useMemo(() => list.findIndex((d) => d.value === value), [list, value]);

  const handleMouseMoveOnDoc = (ev) => {
    setOffsetY((pre) => {
      const diff = ev.clientY - pointerSaved.current.y;
      pointerSaved.current.y = ev.clientY;
      return pre + diff;
    });
  };

  const handleMouseUpOnDoc = (ev) => {
    document.removeEventListener('mousemove', handleMouseMoveOnDoc);
    document.removeEventListener('mouseup', handleMouseUpOnDoc);
    const dist = Math.sqrt(Math.abs(pointerSaved.current.position[0] - ev.clientX) ** 2 + Math.abs(pointerSaved.current.position[1] - ev.clientY) ** 2);
    if (pointerSaved.current.value !== null
      && dist <= fontSize * 0.3
      && (Date.now() - pointerSaved.current.time <= 200)) {
      const nextValue = pointerSaved.current.value;
      pointerSaved.current = null;
      if (nextValue !== value) {
        onChange(nextValue);
      }
    } else {
      const offsetIndex = Math.round((pointerSaved.current.position[1] - ev.clientY) / pointerSaved.current.itemHeight);
      pointerSaved.current = null;
      if (offsetIndex !== 0) {
        let nextIndex = Math.max(Math.min(list.length - 1, currentIndex + offsetIndex), 0);
        if (list[nextIndex].disabled) {
          if (offsetIndex > 0) {
            nextIndex = _.findLastIndex(list, ((d, i) => !d.disabled && i > currentIndex));
          } else {
            nextIndex = list.findIndex((d, i) => !d.disabled
              && i < currentIndex);
          }
        }
        if (nextIndex !== -1) {
          onChange(list[nextIndex].value);
        }
      }
    }
    setOffsetY(0);
  };

  const handleMouseDown = (ev) => {
    document.addEventListener('mousemove', handleMouseMoveOnDoc);
    document.addEventListener('mouseup', handleMouseUpOnDoc);
    const ret = ev.currentTarget.getBoundingClientRect();
    pointerSaved.current = {
      y: ev.clientY,
      value: ev.target.dataset.disabled !== 'true' && /^\d+$/.test(ev.target.dataset.value) ? parseInt(ev.target.dataset.value, 10) : null,
      position: [ev.clientX, ev.clientY],
      itemHeight: ret.height / DISPLAY_COUNT,
      time: Date.now(),
    };
  };

  return (
    <div
      css={css`
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      `}
      onMouseDown={handleMouseDown}
    >
      {
        list
          .map((item, i) => (
            <a
              key={item.id}
              css={css`
                display: flex;
                align-items: center;
                padding: 0 0.6rem;
                font-size: 1.1rem;
                font-weight: bold;
                justify-content: space-between;
                position: absolute;
                left: 0;
                width: 100%;
              `}
              style={{
                background: item.disabled ? '#f0f0f0' : null,
                color: item.disabled ? 'rgba(0, 0, 0, 0.25)' : null,
                transition: pointerSaved.current ? null : 'top 0.3s',
                top: `calc(${1 / DISPLAY_COUNT * 100 * (i - currentIndex + 2)}% + ${offsetY}px)`,
                height: `${1 / DISPLAY_COUNT * 100}%`,
              }}
              data-value={item.value}
              data-disabled={item.disabled}
            >
              {item.name}
            </a>
          ))
      }
    </div>
  );
});

Content.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
  })).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Content;
