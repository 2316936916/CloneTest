import { memo, useEffect, useState } from 'react';
import Backdrop from 'components/Backdrop';
import Spinner from 'components/Spinner';
import useStore from '../useStore';

const Loading = memo(() => {
  const { state } = useStore();
  const { loadingShow } = state;
  const [show, setShow] = useState(loadingShow);

  useEffect(() => {
    let timeID;
    if (loadingShow) {
      setShow(true);
    } else {
      timeID = setTimeout(() => {
        setShow(false);
      }, 50);
    }
    return () => {
      if (timeID != null) {
        clearTimeout(timeID);
      }
    };
  }, [
    loadingShow,
  ]);

  if (!show) {
    return null;
  }

  return (
    <Backdrop>
      <Spinner />
    </Backdrop>
  );
});

export default Loading;
