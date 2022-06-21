import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import _ from 'lodash';
import useFontSize from 'hooks/useFontSize';
import { useLocation } from 'wouter';
import Icon from 'components/Icon';
import IconBtn from 'components/IconBtn';

const ItemGroup = memo(({
    item,
    depth,
}) => {
    const [location, setLocation] = useLocation();
    if (location === '/tender' || location === '/') {
      setLocation('/tender/setup/register');
    }
    const isActive = !location.indexOf(item.path === 0);
    const [collapsed, setCollapse] = useState(isActive);
    const fontSize = useFontSize();

    return (
      <div>
        <a
          css={css`
              position: relative;
              display: flex;
              height: 4rem;
              align-items: center;
              padding: 0 1rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              background: ${(location.indexOf(item.path) !== (-1) && _.isEmpty(item.list)) ? 'rgba(0, 0, 0, 0.21)' : ''};
              color: ${(location.indexOf(item.path) !== (-1) && _.isEmpty(item.list)) ? '#fff' : ''};
          `}
          onClick={() => {
            setCollapse(!collapsed);
            if (_.isEmpty(item.list)) {
              setLocation(item.path);
            }
          }}
        >
          {item.icon && (
            <Icon
              code={item.icon}
              color="currentColor"
              style={{ marginRight: '0.6rem' }}
            />
          )}
          <span style={{ marginLeft: fontSize * (depth + 1) }}>{item.name}</span>
          {
            isActive && (
              <i
                css={css`
                  pointer-events: none;
                  position: absolute;
                  width: 3px;
                  height: 2rem;
                  right:0;
                  top:1rem;
                  background: ${(location.indexOf(item.path) !== (-1) && _.isEmpty(item.list)) ? '#9AC8FF' : ''};
                `}
              />
            )
          }
          {
            !_.isEmpty(item.list) && (
              <IconBtn
                code="e6b9"
                color="#fff"
                css={css`
                  width: 1rem;
                  height: 1rem;
                  position: absolute;
                  right: 1rem;
                  transition: 0.2s;
                `}
                style={{ transform: !collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
              />
            )
          }
        </a>
        {
          !collapsed
          && !_.isEmpty(item.list) && (
          <div>
            {
              item.list.map((d) => (
                <ItemGroup
                  depth={depth + 1.8}
                  key={d.name}
                  item={d}
                />
              ))
            }
          </div>
          )
        }
      </div>
    );
});

ItemGroup.propTypes = {
    depth: PropTypes.number.isRequired,
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        icon: PropTypes.string,
        path: PropTypes.string.isRequired,
        list: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
        })),
    }),
};

export default ItemGroup;
