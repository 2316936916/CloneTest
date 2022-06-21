import {
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
} from 'react';

const useResourceUpload = (onDone) => {
  const [percent, setPercent] = useState(0);
  const xhrSaved = useRef();
  const mountedSaved = useRef(true);
  const onDoneSaved = useRef(onDone);
  const objectURLSaved = useRef();
  const [objectURL, setObjectURL] = useState();

  useLayoutEffect(() => {
    onDoneSaved.current = onDone;
  });

  useLayoutEffect(() => {
    mountedSaved.current = true;
    return () => {
      mountedSaved.current = false;
      if (objectURLSaved.current) {
        URL.revokeObjectURL(objectURLSaved.current);
        objectURLSaved.current = null;
      }
    };
  }, []);

  useEffect(() => () => {
    if (xhrSaved.current && xhrSaved.current.status === 0) {
      xhrSaved.current.abort();
      xhrSaved.current = null;
    }
  }, []);

  const action = useCallback((blob, entry) => {
    if (objectURLSaved.current) {
      setObjectURL(null);
      URL.revokeObjectURL(objectURLSaved.current);
      objectURLSaved.current = null;
    }
    objectURLSaved.current = URL.createObjectURL(blob);
    setObjectURL(objectURLSaved.current);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('loadend', () => {
      if (mountedSaved.current) {
        if (xhr.status === 200) {
          setPercent(1);
          onDoneSaved.current(JSON.parse(xhr.responseText));
        }
      }
    });
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        if (mountedSaved.current) {
          setPercent(Math.min(event.loaded / event.total, 1));
        }
      }
    });
    let url = entry ? `/${entry}/upload` : '/upload';
    if (blob.name) {
      url = `${url}?name=${encodeURIComponent(blob.name)}`;
    }
    xhr.open('post', url, true);
    xhr.send(blob);
    xhrSaved.current = xhr;
  }, [setPercent]);

  const revokeObjectURL = useCallback(() => {
    setObjectURL(null);
    if (objectURLSaved.current) {
      URL.revokeObjectURL(objectURLSaved.current);
      objectURLSaved.current = null;
    }
  }, []);

  return {
    percent,
    action,
    objectURL,
    revokeObjectURL,
  };
};

export default useResourceUpload;
