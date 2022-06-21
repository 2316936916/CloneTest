import {
  memo,
  useEffect,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { css } from '@emotion/react';
import {
  TOASTR_TYPE_INFO,
  TOASTR_TYPE_SUCCESS,
  TOASTR_TYPE_WARN,
  TOASTR_TYPE_ERROR,
  toastrTypeColorMap,
} from 'App/constants';
import IconBtn from 'components/IconBtn';

const Item = memo(({
  item,
  onRemove,
}) => {
  const [isActive, setActive] = useState(false);
  useEffect(() => {
    let timer;
    if (!isActive) {
      timer = setTimeout(() => {
        onRemove(item._id);
      }, item.duration || 2000);
    }
    return () => {
      if (timer != null) {
        clearTimeout(timer);
      }
    };
  }, [item, isActive, onRemove]);

  const style = useMemo(() => {
    if (!item.position) {
      return {};
    }
    return {
      position: 'fixed',
      zIndex: 2004,
      ..._.pick(item.position, ['top', 'left', 'right', 'bottom', 'transform']),
    };
  }, [item]);

  return (
    <div
      css={css`
        height: 4.2rem;
        width: 22rem;
        padding: 0 0.6rem;
        display: flex;
        align-items: center;
        border-radius: 3px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        color: #fff;
        justify-content: space-between;
      `}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{
        ...style,
        background: toastrTypeColorMap[item.type],
      }}
    >
      <span
        css={css`
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        `}
      >
        {item.content}
      </span>
      <IconBtn
        code="eaf2"
        onClick={() => onRemove(item._id)}
        color="#fff"
        css={css`
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        `}
      />
    </div>
  );
});

Item.propTypes = {
  onRemove: PropTypes.func.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      TOASTR_TYPE_INFO,
      TOASTR_TYPE_SUCCESS,
      TOASTR_TYPE_WARN,
      TOASTR_TYPE_ERROR,
    ]).isRequired,
    duration: PropTypes.number,
    position: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number.isRequired,
      transform: PropTypes.string,
    }),
  }).isRequired,
};

export default Item;
