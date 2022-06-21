import {
  useState,
  memo,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { css } from '@emotion/react';
import isHotkey from 'is-hotkey';
import Paper from 'components/Paper';
import IconBtn from 'components/IconBtn';

const Modal = memo(({
  onClose,
  children,
  className,
  title = '',
}) => {
  const [position, setPosition] = useState();
  const headerRef = useRef();
  const pointerSaved = useRef();

  useEffect(() => {
    const handleKeydown = (ev) => {
      if (isHotkey('Esc', ev)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClose]);

  const handleMouseMoveOnDoc = (ev) => {
    const diffX = ev.clientX - pointerSaved.current.x;
    const diffY = ev.clientY - pointerSaved.current.y;
    setPosition([pointerSaved.current.offsetX + diffX, pointerSaved.current.offsetY + diffY]);
  };
  const handleMouseUpOnDoc = () => {
    document.removeEventListener('mousemove', handleMouseMoveOnDoc);
    document.removeEventListener('mouseup', handleMouseUpOnDoc);
    pointerSaved.current = null;
    document.body.style.userSelect = '';
  };

  const handleMouseDownOnHeader = (ev) => {
    const rect = headerRef.current.parentElement.getBoundingClientRect();
    pointerSaved.current = {
      x: ev.clientX,
      y: ev.clientY,
      offsetX: rect.x,
      offsetY: rect.y,
    };
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMoveOnDoc);
    document.addEventListener('mouseup', handleMouseUpOnDoc);
    setPosition([rect.x, rect.y]);
  };

  return ReactDOM.createPortal(
    (
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 201;
          background: rgba(0, 0, 0, 0.4);
          overflow: hidden;
        `}
        aria-label="modal"
        onWheel={(ev) => ev.stopPropagation()}
      >
        <Paper
          className={className}
          css={css`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 32rem;
          `}
          style={{
            ...position ? {
              left: position[0],
              top: position[1],
              transform: 'translate(0, 0)',
            } : {},
          }}
        >
          <div
            aria-label="header"
            css={css`
              height: 2.4rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 0.6rem;
              background: #f5f5f5;
              border-radius: 3px 3px 0 0;
            `}
            ref={headerRef}
            onMouseDown={handleMouseDownOnHeader}
          >
            <div
              css={css`
                flex-grow: 1;
                overflow: hidden;
              `}
              style={{
                textOverflow: typeof title === 'string' ? 'ellipsis' : null,
              }}
            >
              {
                typeof title === 'string'
                  ? (
                    <span
                      css={css`
                        font-size: 1.1rem;
                        font-weight: bold;
                        white-space: nowrap;
                        font-size: 1.1rem;
                        font-weight: bold;
                      `}
                      onMouseDown={(ev) => ev.stopPropagation()}
                    >
                      {title}
                    </span>
                  )
                  : title
              }
            </div>
            <IconBtn
              code="e625"
              onClick={() => onClose()}
              onMouseDown={(ev) => ev.stopPropagation()}
              css={css`
                margin-left: 1.2rem;
                flex-shrink: 0;
                width: 1.2rem;
                height: 1.2rem;
              `}
            />
          </div>
          <div
            aria-label="content"
            css={css`
              padding: 1.2rem;
            `}
          >
            {children}
          </div>
        </Paper>
      </div>
    ),
    document.body,
  );
});

Modal.propTypes = {
  children: PropTypes.any.isRequired, // eslint-disable-line
  className: PropTypes.string,
  title: PropTypes.any, // eslint-disable-line
  onClose: PropTypes.func.isRequired,
};

export default Modal;
