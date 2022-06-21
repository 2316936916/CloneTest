import { memo, useMemo } from 'react';
import {
  Route,
  Switch,
} from 'wouter';
import _ from 'lodash';
import Test from 'pages/Test';
import list from 'pages/list';

const Pages = memo(() => {
  const pageList = useMemo(() => {
    const traversal = (arr, pre) => {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const path = `${pre}${item.path}`;
        if (item.component) {
          result.push({
            ...item,
            path,
          });
        }
        if (!_.isEmpty(item.list)) {
          result.push(...traversal(item.list, path));
        }
      }
      return result;
    };
    return [
      ...traversal(list, __BASE_PATH__),
      ...process.env.NODE_ENV === 'development' ? [
        {
          path: '/test',
          component: Test,
        },
      ] : [],
    ].reverse();
  }, []);

  return (
    <Switch>
      {
        pageList
          .filter((pageItem) => pageItem.component)
          .map((pageItem) => (
            <Route
              key={pageItem.path}
              path={pageItem.path}
              component={pageItem.component}
            />
          ))
      }
    </Switch>
  );
});

export default Pages;
