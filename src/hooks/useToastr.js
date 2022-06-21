import useStore from 'App/useStore';
import { toastrTypeNameMap } from 'App/constants';

const useToastr = () => {
  const { dispatch } = useStore();
  return {
    clear: () => {
      dispatch.clearToastr();
    },
    ...Object.keys(toastrTypeNameMap).reduce((acc, cur) => ({
      ...acc,
      [toastrTypeNameMap[cur]]: (content, { position, duration } = {}) => {
        dispatch.addToastr({
          type: parseInt(cur, 10),
          content,
          position,
          duration,
        });
      },
    }), {}),
  };
};

export default useToastr;
