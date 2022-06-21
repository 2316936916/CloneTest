import {
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';

const useData = (config) => {
  const [data, setData] = useState(null);

  const configSaved = useRef(config);

  useLayoutEffect(() => {
    if (config) {
      configSaved.current = config;
      setData((prev) => {
        if (!prev) {
          return Object.keys(config).reduce((acc, key) => ({
            ...acc,
            [key]: config[key].value,
          }), {});
        }
        return prev;
      });
    } else {
      configSaved.current = null;
      setData(null);
    }
  }, [config]);

  const setValue = useCallback((key, value) => {
    if (data) {
      if (typeof key === 'function') {
        setData((v) => ({
          ...v,
          ...key(v),
        }));
      } else if (Object.hasOwnProperty.call(data, key)) {
        setData({
          ...data,
          [key]: value,
        });
      }
    }
  }, [data, setData]);

  const getValue = useCallback((key) => {
    if (!data) {
      return null;
    }
    return data[key];
  }, [data]);

  const output = useCallback((dataKey) => {
    if (!data) {
      return dataKey ? null : {};
    }
    if (dataKey) {
      const handler = configSaved.current[dataKey].output;
      if (handler) {
        return handler(data[dataKey]);
      }
      return data[dataKey];
    }
    const ret = Object
      .keys(data)
      .reduce((acc, key) => {
        const handler = configSaved.current[key].output;
        const value = data[key];
        return {
          ...acc,
          [key]: handler ? handler(value) : value,
        };
      }, {});
    return ret;
  }, [data]);

  const validate = useCallback((...args) => {
    if (!data) {
      return [null, null, ''];
    }
    if (args.length !== 0) {
      const [dataKey] = args;
      if (Object.hasOwnProperty.call(data, dataKey)) {
        const { match } = configSaved.current[dataKey];
        if (!match) {
          return null;
        }
        const value = data[dataKey];
        try {
          const ret = match(value, data, validate);
          if (ret) {
            return null;
          }
          return [dataKey, value, ''];
        } catch (error) {
          return [dataKey, value, error.message];
        }
      }
      return [dataKey, null, `\`${dataKey}\` unregist`];
    }
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const dataKey = keys[i];
      const value = data[dataKey];
      const { match } = configSaved.current[dataKey];
      if (match) {
        try {
          const ret = match(value, data, validate);
          if (!ret) {
            return [dataKey, value, ''];
          }
        } catch (error) {
          return [dataKey, value, error.message];
        }
      }
    }
    return null;
  }, [data]);

  return useMemo(() => ({
    data,
    setValue,
    getValue,
    output,
    validate,
  }), [
    data,
    setValue,
    getValue,
    output,
    validate,
  ]);
};

export default useData;
