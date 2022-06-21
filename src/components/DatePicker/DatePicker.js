import {
  memo,
  useState,
  useMemo,
  useCallback,
  Fragment,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { format } from 'utils/date';
import Icon from 'components/Icon';
import Field from 'components/Field';
import IconBtn from 'components/IconBtn';
import Picker from './Picker';

const DatePicker = memo(({
  placeholder = '',
  value,
  startOf,
  endOf,
  onChange,
  clearable = true,
}) => {
  const [isActive, setActive] = useState(false);
  const [isMouseEnter, setMouseEnter] = useState(false);
  const container = useRef();

  const textDisplay = useMemo(() => {
    if (!value && !placeholder) {
      return '';
    }
    if (!value) {
      return placeholder;
    }
    return format(value);
  }, [value, placeholder]);

  const handleHide = useCallback(() => {
    setActive(false);
  }, [setActive]);

  return (
    <Fragment>
      <div
        css={css`
          position: relative;
        `}
        aria-label="date-picker"
        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)}
        ref={container}
      >
        <Field
          isActive={isActive}
        >
          <a
            css={css`
              display: flex;
              height: 100%;
              width: 100%;
              align-items: center;
              padding: 0 0.6rem;
              > * {
                pointer-events: none;
              }
            `}
            onMouseDown={() => {
              setActive(!isActive);
            }}
          >
            <span
              css={css`
                margin-left: 0.4rem;
              `}
              style={{
                color: value ? null : '#b3b3b3',
              }}
            >
              {textDisplay}
            </span>
          </a>
          {
            (isMouseEnter && !isActive && clearable && value) ? (
              <IconBtn
                onClick={() => onChange(null)}
                color="#666"
                code="eaf2"
                css={css`
                  width: 1.2rem;
                  height: 1.2rem;
                  position: absolute;
                  top: 50%;
                  right: 0.6rem;
                  transform: translateY(-50%);
                `}
              />
            ) : (
              <Icon
                code="e644"
                color="#D9D9D9"
                css={css`
                  pointer-events: none;
                  position: absolute;
                  width: 1.2rem;
                  width: 1.2rem;
                  top: 50%;
                  right: 0.6rem;
                  transform: translateY(-50%);
                `}
              />
            )
          }
        </Field>
      </div>
      {
        isActive && (
          <Picker
            elem={container.current}
            value={value}
            onChange={onChange}
            startOf={startOf}
            endOf={endOf}
            onHide={handleHide}
          />
        )
      }
    </Fragment>
  );
});

DatePicker.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.number),
  startOf: PropTypes.arrayOf(PropTypes.number),
  endOf: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  clearable: PropTypes.bool,
};

export default DatePicker;
