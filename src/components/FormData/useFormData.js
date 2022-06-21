import { useContext } from 'react';
import Context from './Context';

const useFormData = () => {
  const state = useContext(Context);

  return state;
};

export default useFormData;
