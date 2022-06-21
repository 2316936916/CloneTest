import {
  useState,
  memo,
  useMemo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import Field from 'components/Field';
import IconBtn from 'components/IconBtn';
import Picker from './Picker';

const MonthPicker = memo(({
  value,
  placeholder = '',
  onChange,
  clearable,
}) => {
  const [rect, setRect] = useState();
  const [isMouseEnter, setMouseEnter] = useState(false);
  const textDisplay = useMemo(() => {
    if (!value) {
      return placeholder;
    }
    return `${value[0]}年 ${(value[1] + 1).toString().padStart(2, '0')}月`;
  }, [value, placeholder]);

  return (
    <Fragment>
      <Field
        css={css`
          padding: 0 0.6rem;
        `}
        isActive={!!rect}
        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)}
      >
        <a
          css={css`
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            > * {
              pointer-events: none;
            }
          `}
          onMouseDown={(ev) => {
            if (!rect) {
              const _rect = ev.target.parentElement.getBoundingClientRect();
              const temp = {
                x: _rect.x,
                y: _rect.y,
                height: _rect.height,
                width: _rect.width,
              };
              requestAnimationFrame(() => {
                setRect(temp);
              });
            }
          }}
        >
          <Icon
            code="e66b"
            color="#999"
          />
          <span
            css={css`
              margin-left: 0.4rem;
            `}
            style={{
              color: !value ? '#b3b3b3' : null,
            }}
          >
            {textDisplay}
          </span>
        </a>
        {
          clearable && isMouseEnter && value && !rect && (
            <IconBtn
              css={css`
                position: absolute;
                top: 50%;
                right: 0.6rem;
                transform: translateY(-50%);
                width: 1.2rem;
                height: 1.2rem;
              `}
              color="#666"
              code="e623"
              onClick={() => {
                onChange(null);
              }}
            />
          )
        }
      </Field>
      {
        rect && (
          <Picker
            rect={rect}
            defaultYear={value ? value[0] : dayjs().year()}
            defaultMonth={value ? value[1] : dayjs().month()}
            onChange={onChange}
            onHide={() => setRect(null)}
          />
        )
      }
    </Fragment>
  );
});

MonthPicker.propTypes = {
  clearable: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.number),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default MonthPicker;
