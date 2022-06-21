import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useColumn from './useColumn';

const Row = memo(({
  list,
  ...other
}) => {
  const { sizeList, columnList } = useColumn();

  return (
    <div
      css={css`
        display: flex;
      `}
      {...other}
    >
      {
          columnList
            .map((columnItem, i) => {
              const cellItem = list[i];
              const type = typeof cellItem;
              const size = sizeList[i];
              return (
                <div
                  key={columnItem.key}
                  aria-label={`cell-${i}`}
                  css={css`
                    position: relative;
                    flex-shrink: 0;
                    overflow-x: hidden;
                  `}
                  style={{
                    flexBasis: size ? `${size.percent * 100}%` : null,
                  }}
                  title={type === 'string' ? cellItem : null}
                >
                  {
                    type === 'function'
                      ? (size ? cellItem(size, i) : '')
                      : cellItem
                  }
                </div>
              );
            })
        }
    </div>
  );
});

Row.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any).isRequired, // eslint-disable-line
};

export default Row;
