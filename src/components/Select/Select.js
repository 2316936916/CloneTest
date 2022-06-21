import {
  useState,
  useMemo,
  useCallback,
  Fragment,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Icon from 'components/Icon';
import IconBtn from 'components/IconBtn';
import Field from 'components/Field';
import PopList from 'components/PopList';

const Select = forwardRef(({
  list,
  placeholder,
  value,
  onChange,
  className,
  clearable = true,
}, ref) => {
  const [isMouseEnter, setMouseEnter] = useState(false);
  const [isActive, setActive] = useState(false);
  const container = useRef();

  const isEmpty = value == null || value === '';

  const displayText = useMemo(() => {
    if (isEmpty) {
      return placeholder || '';
    }
    return list.find((item) => item._id === value)?.name || placeholder;
  }, [value, list, placeholder, isEmpty]);

  useImperativeHandle(ref, () => ({
    name: () => {
      if (value == null) {
        return null;
      }
      return list.find((item) => item._id === value).name;
    },
    focus: () => {
      setActive(true);
    },
  }));

  const clearableShow = clearable && isMouseEnter && !isEmpty && !isActive;

  const handleHide = useCallback(() => {
    setActive(false);
  }, [setActive]);

  const iconStyle = css`
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 0.4rem;
    display: block;
    width: 1.2rem;
    height: 1.2rem;
  `;

  return (
    <Fragment>
      <div
        ref={container}
        className={className}
      >
        <Field
          isActive={isActive}
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
        >
          <a
            css={css`
              height: 100%;
              width: 100%;
              display: flex;
              align-items: center;
              position: relative;
              padding-left: 0.6rem;
              padding-right: 2rem;
            `}
            title={isEmpty ? '' : displayText}
            onMouseDown={() => {
              setActive(!isActive);
            }}
          >
            <span
              css={css`
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
              style={{
                color: isEmpty ? '#b3b3b3' : null,
              }}
            >
              {displayText}
            </span>
          </a>
          {/** 下拉框图标 */}
          {
            clearableShow
              ? (
                <IconBtn
                  css={css`
                    ${iconStyle}
                  `}
                  code="eaf2"
                  color="#888"
                  onMouseDown={(ev) => {
                    ev.stopPropagation();
                    onChange(null);
                  }}
                />
              ) : (
                <Icon
                  css={css`
                    ${iconStyle};
                    pointer-events: none;
                  `}
                  color="#D9D9D9"
                  code="eb17"
                />
                // 长显示图标
              )
          }
        </Field>
      </div>
      {
        isActive && (
          <PopList
            list={list}
            elem={container.current}
            onHide={handleHide}
          >
            {
              (item) => (
                <a
                  css={css`
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding: 0 0.6rem;
                    transition: background 0.3s;
                    &:hover {
                      background: #f0f0f0;
                    }
                  `}
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    if (item._id !== value) {
                      onChange(item._id);
                    }
                    setActive(false);
                  }}
                  title={item.name}
                >
                  <span
                    css={css`
                      width: 100%;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    `}
                  >
                    {item.name}
                  </span>
                </a>
              )
            }
          </PopList>
        )
      }
    </Fragment>
  );
});

Select.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  clearable: PropTypes.bool,
};

export default Select;
