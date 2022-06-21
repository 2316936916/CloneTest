import { Fragment, useMemo } from 'react';
import _ from 'lodash';
import list from 'pages/list';
import ItemGroup from './ItemGroup';

function Menus() {
  // 实现所有路由前拼接一个主路由
  const displayList = useMemo(() => {
    const traversal = (arr, base) => {
      if (_.isEmpty(arr)) {
        return [];
      }
      const result = [];
      const len = arr.length;
      for (let i = 0; i < len; i++) {
        const item = arr[i];
        if (item.show !== false) {
          const currentPath = `${base}${item.path}`;
          result.push({
            ...item,
            path: currentPath,
            list: traversal(item.list, currentPath),
          });
        }
      }
      return result;
    };

    return traversal(list, __BASE_PATH__);
  }, []);

  return (
    <Fragment>
      {
        displayList
          .map((item) => (
            <ItemGroup
              depth={-1}
              key={item.name}
              item={item}
            />
          ))
      }
    </Fragment>
  );
}

export default Menus;
