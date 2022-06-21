import { Fragment, memo, useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import useFontSize from 'hooks/useFontSize';
import Icon from 'components/Icon';

const SubList = memo(({
  list,
  depth,
  insideValue,
  itemHeight,
  columnWidth,
  onChange,
}) => {
  const [curValue, setCurValue] = useState(insideValue[depth]);
  const fontSize = useFontSize();
  return (
    <Fragment>
      <div
        css={css`
          height: 100%;
          overflow: auto;
        `}
        style={{
          width: columnWidth * fontSize,
        }}
      >
        {
          list.map((d) => (
            <div
              key={d.id}
              css={css`
                padding: 0 0.6rem;
                display: flex;
                flex-wrap: nowrap;
                cursor: pointer;
                align-items: center;
                &:hover {
                  background: #F5F5F5;
                }
                transition: all .3s;
              `}
              style={{
                background: curValue === d.id ? 'rgba(233, 237, 255, 1)' : '',
                height: itemHeight * fontSize,
              }}
              onClick={() => {
                if (_.isEmpty(d.children)) {
                  onChange([d.id]);
                }
                setCurValue(d.id);
              }}
            >
              <span
                css={css`
                  white-space: nowrap;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  transition: all .3s;
                `}
                title={d.name}
                style={{
                  color: curValue === d.id ? '#000000' : '',
                }}
              >
                {d.name}
              </span>
              <Icon
                code="e6b9"
                color="#00000073"
                css={css`
                  margin-left: 1rem;
                  width: 0.8rem;
                  height: 0.8rem;
                  transform: rotate(-90deg);
                `}
                style={{ visibility: !_.isEmpty(d.children) ? 'visible' : 'hidden' }}
              />
            </div>
          ))
        }
      </div>
      {
        (() => {
          if (!curValue) {
            return null;
          }
          const nextList = list.find((d) => d.id === curValue)?.children || [];
          if (_.isEmpty(nextList)) {
            return null;
          }
          return (
            <SubList
              list={nextList}
              depth={depth + 1}
              insideValue={insideValue}
              itemHeight={itemHeight}
              columnWidth={columnWidth}
              onChange={(v) => onChange([curValue, ...v])}
            />
          );
        })()
      }
    </Fragment>
  );
});

SubList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
  depth: PropTypes.number,
  insideValue: PropTypes.arrayOf(PropTypes.shape({})),
  itemHeight: PropTypes.number,
  columnWidth: PropTypes.number,
  onChange: PropTypes.func,
};

export default SubList;
