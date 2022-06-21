import React, {
  memo,
  useState,
  Fragment,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import isHotkey from 'is-hotkey';
import Backdrop from 'components/Backdrop';
import IconBtn from 'components/IconBtn';
import ConfirmBar from 'components/ConfirmBar';

const Confirm = memo(({
  children,
  onConfirm,
  onCancel,
  className,
  title = '删除',
  content,
}) => {
  const outsideClickSaved = useRef(false);
  const [modalShow, setModalShow] = useState(false);

  const handleClickOnEnsure = useCallback(() => {
    setModalShow(false);
    onConfirm();
  }, [onConfirm]);

  const handleClickOnCancel = useCallback(() => {
    setModalShow(false);
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    const handleKeydownOnDoc = (ev) => {
      if (isHotkey('Esc')(ev)) {
        ev.preventDefault();
        ev.stopPropagation();
        setModalShow(false);
      }
    };
    document.addEventListener('keydown', handleKeydownOnDoc);
    return () => {
      document.removeEventListener('keydown', handleKeydownOnDoc);
    };
  });

  return (
    <Fragment>
      {
        React.cloneElement(children, {
          onClick: (ev) => {
            ev.stopPropagation();
            setModalShow(true);
          },
        })
      }
      {
        modalShow && (
          <Backdrop
            onMouseDown={() => {
              outsideClickSaved.current = true;
            }}
            onMouseUp={() => {
              if (outsideClickSaved.current) {
                setModalShow(false);
              }
            }}
          >
            <div
              css={css`
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 28rem;
                background: #fbfbfb;
                border-radius: 3px 3px 3px 3px;
                box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
              `}
              onMouseDown={(ev) => {
                ev.stopPropagation();
                outsideClickSaved.current = false;
              }}
              onMouseUp={(ev) => {
                ev.stopPropagation();
                outsideClickSaved.current = false;
              }}
              className={className}
            >
              <div
                css={css`
                  height: 3.2rem;
                  display: flex;
                  font-size: 1.1rem;
                  background: #fff;
                  border-bottom: 1px solid rgba(110, 117, 130, 0.1);
                  padding: 0 1rem;
                  justify-content: space-between;
                  align-items: center;
                  font-weight: bold;
                  border-top-left-radius: 3px;
                  border-top-right-radius: 3px;
                `}
              >
                <span>{title}</span>
                <IconBtn
                  code="e625"
                  css={css`
                    width: 1.2rem;
                    height: 1.2rem;
                  `}
                  onClick={() => setModalShow(false)}
                />
              </div>
              <div
                css={css`
                  padding: 1.2rem;
                `}
              >
                <div
                  css={css`
                    height: 2.4rem;
                    font-size: 1.2rem;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}
                  aria-label="confirm-content"
                >
                  {
                    content || (
                      <span>
                        确认操作?
                      </span>
                    )
                  }
                </div>
                <ConfirmBar
                  onConfirm={handleClickOnEnsure}
                  onCancel={handleClickOnCancel}
                />
              </div>
            </div>
          </Backdrop>
        )
      }
    </Fragment>
  );
});

Confirm.propTypes = {
  children: PropTypes.element.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Confirm;
