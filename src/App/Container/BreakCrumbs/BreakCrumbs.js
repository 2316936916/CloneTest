import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { css } from '@emotion/react';
import Icon from 'components/Icon';
import list from 'pages/list';

function BreakCrumbs() {
  const [location] = useLocation();
  const displayList = useMemo(() => {
    const getRoute = (arr, routeList, depth) => {
      const name = arr[depth];
      if (!name) {
        return [];
      }
      const routerItem = routeList.find((d) => /^\/:\w+/.test(d.path) || d.path === `/${name}`);
      if (!routerItem) {
        return [];
      }
      return [
        {
          ...routerItem,
          isLink: !!routerItem.component || /^\/:\w+/.test(routerItem.path),
          path: `${depth === 0 ? '' : '/'}${arr.slice(0, depth).join('/')}/${name}`,
        },
        ...getRoute(arr, routerItem.list || [], depth + 1),
      ];
    };
    const [, ...pathList] = location.split('/').filter((s) => s !== '');
    return getRoute(pathList, list, 0);
  }, [location]);

  if (displayList.length === 0) {
    return null;
  }

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      {displayList.map((item, i) => {
        const style = css`
          display: flex;
          padding: 0.6rem 0.4rem 0.6rem 0;
          font-size: 1rem;
          align-items: center;
          color: rgb(51, 51, 51);
          &:last-child {
            font-weight: bold;
            color: "rgba(0, 0, 0, 0.4)";
          }
        `;
        const displayName = item.name;
        if (i === displayList.length - 1 || i === 0) {
          return (
            <div
              key={item.path}
              css={css`
                cursor: Default;
                ${style}
              `}
            >
              {i !== 0 && (
                <span
                  css={css`
                    margin-right: 0.4rem;
                  `}
                >
                  /
                </span>
              )}
              {i === 0 && (
                <Icon
                  code={i === 0 ? 'e601' : 'e62f'}
                  css={css`
                    height: 1rem;
                    margin-right: 0.3rem;
                  `}
                  color={i === displayList.length - 1 ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.4)'}
                />
              )}
              <span>{displayName}</span>
            </div>
          );
        }
        return (
          <div
            key={item.path}
            css={css`
              cursor: Default;
              ${style}
            `}
          >
            {i !== 0 && (
              /* <Icon
                  code="e614"
                  color="rgba(0, 0, 0, 0.4)"
                  css={css`
                        height: 0.6rem;
                        margin-right: 0.4rem;
                      `}
                /> */
              <span
                css={css`
                  margin-right: 0.4rem;
                `}
              >
                /
              </span>
            )}
            <span>{displayName}</span>
          </div>
        );
      })}
    </div>
  );
}

export default BreakCrumbs;
