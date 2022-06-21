import {
  useMemo,
  memo,
  Fragment,
  useState,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import Field from 'components/Field';
import IconBtn from 'components/IconBtn';
import Picker from './Picker';

const DateTimePicker = memo(({
  value,
  onChange,
  placeholder = '',
  startOf,
  endOf,
  clearable = true,
}) => {
  const [isActive, setActive] = useState(false);
  const [isMouseEnter, setMouseEnter] = useState(false);
  const container = useRef();
  const textDisplay = useMemo(() => {
    if (!value) {
      return placeholder;
    }
    return dayjs()
      .year(value[0])
      .month(value[1])
      .date(value[2])
      .hour(value[3])
      .minute(value[4])
      .format('YYYY-MM-DD HH:mm');
  }, [
    placeholder,
    value,
  ]);

  const handleHide = useCallback(() => {
    setActive(false);
  }, [setActive]);

  return (
    <Fragment>
      <div
        ref={container}
      >
        <Field
          isActive={isActive}
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
        >
          <a
            css={css`
              padding: 0 0.6rem;
              display: flex;
              align-items: center;
              width: 100%;
              height: 100%;
              > * {
                pointer-events: none;
              }
            `}
            onMouseDown={() => {
              setActive(!isActive);
            }}
          >
            <Icon
              code="e6d4"
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
            clearable && isMouseEnter && value && !isActive && (
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
      </div>
      {
        isActive && (
          <Picker
            elem={container.current}
            onChange={onChange}
            defaultDate={value ? value.slice(0, 3) : [dayjs().year(), dayjs().month(), dayjs().date()]}
            defaultHour={value ? value[3] : dayjs().hour()}
            defaultMinute={value ? value[4] : dayjs().minute()}
            onHide={handleHide}
            startOf={startOf}
            endOf={endOf}
          />
        )
      }
    </Fragment>
  );
});

DateTimePicker.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  startOf: PropTypes.arrayOf(PropTypes.number),
  endOf: PropTypes.arrayOf(PropTypes.number),
  placeholder: PropTypes.string,
  clearable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default DateTimePicker;
