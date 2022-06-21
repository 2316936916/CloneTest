import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';

const useResourceObjectURL = (resourceURL) => {
  const [objectURL, setObjectURL] = useState();
  const [pending, setPending] = useState(false);
  const objectURLSaved = useRef();
  const mounted = useRef(true);

  useLayoutEffect(() => () => {
    mounted.current = false;
    if (objectURLSaved.current) {
      URL.revokeObjectURL(objectURLSaved.current);
      objectURLSaved.current = null;
    }
  }, []);

  useEffect(() => {
    let isDone = false;
    let controller;
    if (resourceURL && mounted.current) {
      setPending(true);
      if (objectURLSaved.current) {
        URL.revokeObjectURL(objectURLSaved.current);
        objectURLSaved.current = null;
        setObjectURL(null);
      }
      controller = new AbortController();
      const { signal } = controller;
      fetch(resourceURL, {
        method: 'GET',
        signal,
      })
        .then(
          (res) => {
            isDone = true;
            return res.blob();
          },
        )
        .then((blob) => {
          if (mounted.current) {
            objectURLSaved.current = URL.createObjectURL(blob);
            setPending(false);
            setObjectURL(objectURLSaved.current);
          }
        })
        .catch(() => {
          isDone = true;
          if (mounted.current) {
            setPending(false);
          }
        });
    } else if (mounted.current) {
      setObjectURL(null);
      setPending(false);
    }
    return () => {
      if (!isDone && controller) {
        controller.abort();
      }
    };
  }, [resourceURL]);

  return {
    objectURL,
    pending,
  };
};

export default useResourceObjectURL;
