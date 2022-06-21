import {
  useState,
  memo,
  useMemo,
  useRef,
  Fragment,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import _ from 'lodash';
import isHotkey from 'is-hotkey';
import Icon from 'components/Icon';
import IconBtn from 'components/IconBtn';
import Field from 'components/Field';
import PopList from 'components/PopList';

const FilterSelect = memo(({
  list,
  value,
  onChange,
  onCancel,
  iconCode,
  placeholder,
}) => {
  const [words, setWords] = useState('');
  const inputRef = useRef();
  const [isEnter, setEnter] = useState(false);
  const [isActive, setActive] = useState(false);
  const container = useRef();

  const listDisplay = useMemo(() => {
    const k = words.toUpperCase();
    if (k === '') {
      return list;
    }
    return list.filter((item) => item.name.toUpperCase().includes(k));
  }, [words, list]);

  const placeholderDisplay = useMemo(() => {
    if (isActive) {
      if (words === '') {
        if (value == null) {
          return placeholder;
        }
        return list.find((d) => d._id === value)?.name ?? '';
      }
      return placeholder;
    }
    return placeholder;
  }, [
    list,
    words,
    value,
    isActive,
    placeholder,
  ]);

  const handleHide = useCallback(() => {
    setActive(false);
  }, [setActive]);

  const currentItem = useMemo(() => {
    if (value == null) {
      return null;
    }
    return list.find((item) => item._id === value);
  }, [value, list]);

  const displayName = useMemo(() => {
    if (isActive) {
      return words;
    }
    if (!currentItem) {
      return '';
    }
    return currentItem.name;
  }, [isActive, currentItem, words]);

  return (
    <Fragment>
      <div
        ref={container}
      >
        <Field
          isActive={isActive}
          onMouseEnter={() => setEnter(true)}
          onMouseLeave={() => setEnter(false)}
        >
          {
            iconCode && (
              <Icon
                code={iconCode}
                css={css`
                  width: 1.4rem;
                  height: 1.4rem;
                  position: absolute;
                  top: 50%;
                  left: 0.6rem;
                  transform: translateY(-50%);
                  pointer-events: none;
                `}
                color="#999"
              />
            )
          }
          <input
            placeholder={placeholderDisplay}
            aria-label="filter-select"
            ref={inputRef}
            css={css`
              height: 100%;
              outline: unset;
              background: rgba(0, 0, 0, 0);
              border-width: 0px;
              padding-left: 0.6rem;
              color: #666;
              padding-right: 0.6rem;
              width: 100%;
            `}
            style={{
              paddingLeft: iconCode ? '2.4rem' : null,
            }}
            onKeyDown={(ev) => {
              if (isHotkey('Enter')(ev)) {
                if (words === '' && currentItem) {
                  onChange(value, currentItem);
                } else if (!_.isEmpty(listDisplay)) {
                  const d = listDisplay[0];
                  onChange(d._id, d);
                } else if (onCancel) {
                  onCancel();
                }
                ev.target.blur();
              }
            }}
            onChange={(ev) => {
              setWords(ev.target.value);
            }}
            value={displayName}
            onFocus={() => {
              setActive(true);
              setWords('');
            }}
            onBlur={() => {
              setActive(false);
              requestAnimationFrame(() => {
                setWords('');
              });
            }}
          />
          {
            !isActive && isEnter && value && (
              <IconBtn
                code="eaf2"
                css={css`
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  right: 0.6rem;
                  width: 1.2rem;
                  height: 1.2rem;
                `}
                color="#666"
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  onChange(null);
                }}
              />
            )
          }
        </Field>
      </div>
      {
        isActive && (
          <PopList
            list={listDisplay}
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
                      onChange(item._id, item);
                    }
                    setActive(false);
                    inputRef.current.blur();
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

FilterSelect.propTypes = {
  iconCode: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default FilterSelect;
