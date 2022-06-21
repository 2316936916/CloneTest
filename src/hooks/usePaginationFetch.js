import {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import useActionDo from 'hooks/useActionDo';
import request from 'utils/request';
import { PAGE_SIZE } from 'App/constants';

const usePaginationFetch = (paramsStr, url, handler, pageSize = PAGE_SIZE) => {
  const [list, setList] = useState([]);
  const updatingSaved = useRef(false);
  const actionSaved = useRef();
  const idListSaved = useRef([]);
  const [href, setHref] = useState();
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  useLayoutEffect(() => {
    updatingSaved.current = true;
    setList([]);
    idListSaved.current = [];
    setCount(0);
    setOffset(0);
  }, [paramsStr, setList, setCount, setOffset]);

  useEffect(() => {
    const tickID = setTimeout(() => {
      if (paramsStr == null) {
        setHref(null);
      } else {
        setHref(`${url}?${paramsStr}&pageSize=${pageSize}&pageNum=${Math.floor(offset / pageSize)}`);
      }
    }, 10);
    return () => {
      clearTimeout(tickID);
    };
  }, [paramsStr, pageSize, url, setHref, offset]);

  useEffect(() => {
    setList([]);
    setCount(0);
    setOffset(0);
    idListSaved.current = [];
  }, [url]);

  useEffect(() => {
    const tickID = setTimeout(() => {
      updatingSaved.current = false;
    }, 10);
    return () => {
      clearTimeout(tickID);
    };
  }, [list]);

  const { pending, action } = useActionDo(href, {
    match: (v) => !!v,
    pre: () => setList([]),
    fn: async (v) => {
      const ret = await request.get(v);
      return handler(ret);
    },
    resolve: (ret) => {
      setCount(ret.count);
      setList(() => {
        const newList = ret.list;
        return [...newList];
      });
    },
  });

  useLayoutEffect(() => {
    actionSaved.current = action;
    return () => {
      actionSaved.current = null;
    };
  });

  const changeList = useCallback((newList) => {
    if (newList.length !== list.length) {
      setCount(count + (newList.length - list.length));
    }
    setList(newList);
    idListSaved.current = newList.map((d) => d.id);
  }, [setList, setCount, list, count]);

  const fresh = useCallback(() => {
      action();
  }, [action]);

  return {
    pending,
    list,
    count,
    change: changeList,
    setOffset,
    fresh,
    pageSize,
    offset,
  };
};

export default usePaginationFetch;
