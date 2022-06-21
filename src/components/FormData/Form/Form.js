import { memo } from 'react';
import useFormData from '../useFormData';
import Fields from './Fields';

const Form = memo((props) => {
  const {
    value,
    changeValue,
    fieldList,
  } = useFormData();

  return (
    <Fields
      {...props}
      value={value}
      onChange={changeValue}
      list={fieldList}
    />
  );
});

export default Form;
