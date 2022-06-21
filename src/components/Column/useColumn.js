import { useContext } from 'react';
import Context from './Context';

const useColumn = () => useContext(Context);

export default useColumn;
