import { useState } from 'react';
import request from 'utils/request';
import useActionDo from 'hooks/useActionDo';
import useToastr from 'hooks/useToastr';

const useFileList = (id, onDone) => {
    const toastr = useToastr();
    const [fListData, setFListData] = useState(null);
    const { pending } = useActionDo(id, {
      fn: async (v) => {
        const ret = await request.get(`/api/resources/?_ids=${v}`);
        return ret;
      },
      resolve: (ret) => {
        setFListData(ret);
        if (onDone) {
          onDone(ret);
        }
      },
      reject: (error) => {
        toastr.error(error.message);
      },
    });
    return {
      fListData,
      pending,
    };
};

export default useFileList;
