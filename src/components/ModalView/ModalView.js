import { memo } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { css } from '@emotion/react';
import { IconBtn } from 'components/Display';

const ModalView = memo(({
  onClose,
  children,
  className,
  title = null,
}) => ReactDOM.createPortal(
(
  <div
    css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 101;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 2px;
      `}
    aria-label="modal-view"
    onWheel={(ev) => ev.stopPropagation()}
  >
    <div
      className={className}
      css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32rem;
        `}
    >
      {
          title !== null && (
            <div
              aria-label="header"
              css={css`
                height: 4rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.2rem 1.5rem;
                border-top-left-radius: 2px;
                border-top-right-radius: 2px;
                background: #fff;
              `}
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
                          color: #000;
                          white-space: nowrap;
                          font-size: 1.2rem;
                          font-weight: bold;
                        `}
                      >
                        {title}
                      </span>
                    )
                    : title
                }
              </div>
              <IconBtn
                code="eaf2"
                color="#000"
                onClick={() => onClose()}
                css={css`
                  margin-left: 1.2rem;
                  flex-shrink: 0;
                  width: 1.5rem;
                  height: 1.5rem;
                `}
              />
            </div>
          )
        }
      <div
        aria-label="content"
        css={css`
            background: #ffffff;
            border-bottom-left-radius: 2px;
            border-bottom-right-radius: 2px;
          `}
        style={title !== null ? null : { borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}
      >
        {children}
      </div>
    </div>
  </div>
), document.body,
));

ModalView.propTypes = {
  children: PropTypes.any.isRequired, // eslint-disable-line
  className: PropTypes.string,
  title: PropTypes.any, // eslint-disable-line
  onClose: PropTypes.func.isRequired,
};

export default ModalView;
