import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import useApiFieldsFetch from 'apis/useFieldsFetch';
import {
  fieldListConvertValue,
  validate,
  output,
  input,
} from './utils';
import Context from './Context';

const FormData = memo(({
  form,
  children,
  defaultValue = {},
}) => {
  const { list: fieldList } = useApiFieldsFetch(form);
  const [value, setValue] = useState();
  const defaultValueSaved = useRef(defaultValue);

  useLayoutEffect(() => {
    defaultValueSaved.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    if (fieldList.length === 0) {
      setValue();
    } else {
      const dataInit = fieldListConvertValue(fieldList);
      setValue({
        ...dataInit,
        ...input(defaultValueSaved.current, fieldList),
      });
    }
  }, [fieldList]);

  const state = useMemo(() => ({
    validate: () => validate(value, fieldList),
    output: () => output(value, fieldList),
    changeValue: setValue,
    value,
    fieldList,
  }), [
    value,
    fieldList,
    setValue,
  ]);

  return (
    <Context.Provider
      value={state}
    >
      {
        value && children
      }
    </Context.Provider>
  );
});

FormData.propTypes = {
  form: PropTypes.string.isRequired,
  children: PropTypes.any, // eslint-disable-line
  defaultValue: PropTypes.shape({}),
};

export default FormData;
