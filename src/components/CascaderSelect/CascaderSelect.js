import {
  memo,
  useMemo,
  useState,
  useRef,
  useCallback,
  Fragment,
} from 'react';
import { css } from '@emotion/react';
import { Field } from 'components/Display';
import Icon from 'components/Icon';
import IconBtn from 'components/IconBtn';
import _ from 'lodash';
import PropTypes from 'prop-types';
import CascaderPopList from './CascaderPopList';
import SubList from './SubList';

const CascaderSelect = memo(({
  list = [],
  value,
  onChange,
  placeholder,
  itemHeight = 3,
  itemNum = 7,
  columnWidth = 12,
  clearable = true,
  className,
}) => {
  const displayList = useMemo(() => {
    const initList = list;
    const listToTree = (data, arr) => {
      const children = [];
      const otherChildren = [];
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.parent === data.id) {
          const child = {
            ...item,
            name: item.name,
            id: item.id,
            parent: data.id,
          };
          children.push(child);
        } else {
          otherChildren.push(item);
        }
      }
      return {
        ...data,
        children: children.map((d) => listToTree(d, otherChildren)),
      };
    };

    const rootChildren = [];
    const otherChildren = [];

    initList.forEach((item) => {
      const child = {
        ...item,
        parent: item.parentId,
        name: item.name,
        id: item.id,
      };
      if (item.parentId === '') {
        rootChildren.push(child);
      } else {
        otherChildren.push(child);
      }
    });

    const tree = {
      id: '',
      name: 'root',
      children: rootChildren
        .map((d) => listToTree({
          ...d,
          id: d.id,
          name: d.name,
        }, otherChildren)),
    };
    return tree;
  }, [list]);

  const insideValue = useMemo(() => {
    const map = list.reduce((acc, cur) => ({
      ...acc,
      [cur.id]: {
        ...cur,
      },
    }), {});
    const findParent = (obj, id) => {
      const result = [];
      if (obj[id] !== undefined) {
        result.push(id);
        return [...findParent(obj, obj[id].parentId), ...result];
      }
      return [...result];
    };
    return findParent(map, value);
  }, [list, value]);

  const [isActive, setActive] = useState(false);
  const [isMouseEnter, setMouseEnter] = useState(false);
  const container = useRef();
  const clearableShow = clearable && isMouseEnter && insideValue.length > 0 && !isActive;
  const handleHide = useCallback(() => {
    setActive(false);
  }, [setActive]);

  const displayText = useMemo(() => {
    if (insideValue.length === 0) {
      return placeholder || '';
    }
    const map = list.reduce((acc, cur) => ({
      ...acc,
      [cur.id]: cur.name,
    }), {});
    return insideValue.map((d) => map[d]).join(' / ');
  }, [insideValue, placeholder, list]);

  return (
    <Fragment>
      <div
        ref={container}
      >
        <Field
          isActive={isActive}
          className={className}
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}

        >
          <a
            css={css`
              height: 100%;
              width: 100%;
              padding: 0 0.6rem;
              display: flex;
              align-items: center;
            `}
            title={insideValue.length === 0 ? '' : displayText}
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
                color: insideValue.length === 0 ? '#b3b3b3' : null,
              }}
            >
              {displayText}
            </span>
            {
              clearableShow
                ? (
                  <IconBtn
                    css={css`
                      margin-left: 0.2rem;
                      width: 1.2rem;
                      height: 1.2rem;
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
                    code="e6b9"
                    color="#00000073"
                    css={css`
                      margin-left: 0.6rem;
                      width: 0.8rem;
                      height: 0.8rem;
                      transform: rotate(0deg);
                    `}
                  />
                )
            }
          </a>
        </Field>
      </div>
      {
        isActive && !_.isEmpty(displayList.children) && (
          <CascaderPopList
            elem={container.current}
            onHide={handleHide}
            css={css`
              overflow: hidden;
              display: flex;
              flex-wrap: nowrap;
              align-items: flex-start;
              box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
              >div:not(:last-of-type) {
                border-right: 1px solid rgba(0, 0, 0, 0.03)
              }
              transition: all .3s;
            `}
            height={itemHeight}
            itemNum={itemNum}
          >
            <SubList
              list={displayList.children}
              depth={0}
              insideValue={insideValue}
              itemHeight={itemHeight}
              columnWidth={columnWidth}
              onChange={(v) => {
                onChange(v.length > 0 ? v[v.length - 1] : null);
                setActive(false);
              }}
            />
          </CascaderPopList>
        )
      }
    </Fragment>
  );
});

CascaderSelect.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    parentId: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
  })).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
  itemHeight: PropTypes.number,
  itemNum: PropTypes.number,
  columnWidth: PropTypes.number,
  className: PropTypes.string,
};

export default CascaderSelect;
