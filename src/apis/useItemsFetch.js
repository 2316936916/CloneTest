import { useState } from 'react';
import request from 'utils/request';
import useActionDo from 'hooks/useActionDo';

const useItemsFetch = (id) => {
    const [list, setList] = useState([]);
    const { pending } = useActionDo(id, {
      fn: (v) => request.get(`/api/items/${v}`),
      resolve: (ret) => {
        setList(ret.map((d) => ({
          _id: d.code,
          name: d.name,
        })));
      },
    });
    return {
      list,
      pending,
    };
};

export default useItemsFetch;
