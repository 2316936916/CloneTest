import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { PAGE_SIZE } from 'App/constants';
import useColor from 'hooks/useColor';
import Icon from 'components/Icon';
import SkipBtn from './SkipBtn';

const DISPLAY_COUNT = 5;
const SKIP_PREV = 'skip-prev';
const SKIP_NEXT = 'skip-next';

const PIVOT = Math.ceil(DISPLAY_COUNT / 2);

const Pagination = memo(({
  value: offset,
  size,
  limit = PAGE_SIZE,
  onChange,
}) => {
  const getColor = useColor();
  const pageSize = Math.ceil(size / limit);
  const currentPage = Math.floor(offset / limit);
  const clamp = (n) => Math.max(Math.min(n * limit, size - 1), 0);
  const list = useMemo(() => {
    let result = [];
    const start = Math.max(currentPage - (DISPLAY_COUNT - PIVOT), 0);
    const end = Math.min(currentPage + (DISPLAY_COUNT - PIVOT), pageSize - 1);
    for (let i = 0; i < pageSize; i++) {
      let visible = pageSize <= DISPLAY_COUNT || i === currentPage || i === 0 || (i === pageSize - 1);
      if (!visible) {
        visible = i >= start && i <= end;
      }
      if (!visible) {
        visible = currentPage < DISPLAY_COUNT && i < DISPLAY_COUNT && i >= PIVOT;
      }
      if (!visible) {
        visible = currentPage > pageSize - 1 - DISPLAY_COUNT && i > pageSize - 1 - DISPLAY_COUNT && i < PIVOT + currentPage;
      }
      result.push({
        _id: `${i}`,
        value: i,
        name: `${i + 1}`,
        isActive: currentPage === i,
        visible,
      });
    }
    if (result.length > DISPLAY_COUNT && !result[1].visible) {
      result = [
        result[0],
        {
          _id: SKIP_PREV,
          value: Math.max(0, currentPage - DISPLAY_COUNT),
          name: '向前5页',
          isActive: false,
          visible: true,
        },
        ...result.slice(1),
      ];
    }
    if (result.length > DISPLAY_COUNT && !result[result.length - 2].visible) {
      result = [
        ...result.slice(0, result.length - 2),
        {
          _id: SKIP_NEXT,
          value: Math.min(currentPage + DISPLAY_COUNT, pageSize - 1),
          name: '向后5页',
          isActive: false,
          visible: true,
        },
        result[result.length - 1],
      ];
    }
    return result;
  }, [pageSize, currentPage]);
  return (
    <div
      css={css`
        display: flex;
        user-select: none;
        justify-content: flex-end;
        > a:not(:first-of-type) {
          margin-left: 0.4rem;
        }
        .btn {
          width: 2.2rem;
          height: 2.2rem;
          border: 1px solid #ccc;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          transition: background 0.3s;
        }
      `}
    >
      <a
        className="btn"
        title="上一页"
        style={{
          ...currentPage === 0 ? {
            background: '#f5f5f5',
            color: '#d9d9d9',
            cursor: 'not-allowed',
          } : {},
        }}
        onClick={() => {
          if (currentPage !== 0) {
            onChange(clamp(Math.max(currentPage - 1, 0)));
          }
        }}
      >
        <Icon
          css={css`
            width: 1rem;
            height: 1rem;
          `}
          color="currentColor"
          code="eb15"
        />
      </a>
      {
        list
          .map((item) => {
            if (!item.visible) {
              return null;
            }

            if (item._id === SKIP_PREV || item._id === SKIP_NEXT) {
              return (
                <SkipBtn
                  key={item._id}
                  iconCode={item._id === SKIP_PREV ? 'e708' : 'e708'}//第一个鼠标移入向前的图标,第二个为向后的图标
                  title={item.name}
                  onClick={() => {
                    onChange(clamp(item.value));
                  }}
                />
              );
            }

            return (
              <a
                key={item._id}
                className="btn"
                style={{
                  ...item.isActive ? {
                    color: '#fff',
                    background: getColor('a00'),
                    borderColor: getColor('a00'),
                    cursor: 'Default',
                  } : {},
                }}
                onClick={() => {
                  if (!item.isActive) {
                    onChange(clamp(item.value));
                  }
                }}
                title={item.name}
              >
                {item.name}
              </a>
            );
          })
      }
      <a
        className="btn"
        title="下一页"
        style={{
          ...pageSize === 0 || pageSize - 1 === currentPage ? {
            background: '#f5f5f5',
            color: '#d9d9d9',
            cursor: 'not-allowed',
          } : {},
        }}
        onClick={() => {
          if (pageSize !== 0 && pageSize - 1 !== currentPage) {
            onChange(clamp(Math.max(Math.min(currentPage + 1, pageSize - 1), 0)));
          }
        }}
      >
        <Icon
          css={css`
            width: 1rem;
            height: 1rem;
          `}
          color="currentColor"
          code="eb16"
        />
      </a>
    </div>
  );
});

Pagination.propTypes = {
  size: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  limit: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;
