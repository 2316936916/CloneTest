import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';

const useAction = (options) => {
  const [pending, setPending] = useState();
  const optionsSaved = useRef(options);

  useLayoutEffect(() => {
    optionsSaved.current = options;
    return () => {
      optionsSaved.current = null;
    };
  });

  const action = useCallback(async (...args) => {
    if (!optionsSaved.current || pending) {
      return;
    }
    const matched = optionsSaved.current.match ? optionsSaved.current.match(...args) : true;
    if (optionsSaved.current.pre) {
      optionsSaved.current.pre(matched, ...args);
    }
    if (!matched) {
      return;
    }
    setPending(true);
    try {
      const ret = await optionsSaved.current.fn(...args);
      if (optionsSaved.current && optionsSaved.current.resolve) {
        optionsSaved.current.resolve(ret);
      }
    } catch (error) {
      if (optionsSaved.current && optionsSaved.current.reject) {
        optionsSaved.current.reject(error);
      } else if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    } finally {
      if (optionsSaved.current) {
        setPending(false);
        if (optionsSaved.current.final) {
          optionsSaved.current.final();
        }
      }
    }
  }, [pending, setPending]);

  return {
    action,
    pending,
  };
};

export default useAction;
