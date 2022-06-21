import { memo } from 'react';
import { css } from '@emotion/react';
import Icon from 'components/Icon';
import color from 'utils/color';
import PropTypes from 'prop-types';

const ConfirmModal = memo(({
  onConFirm,
  onCancel,
  message,
  tip = '',
}) => (
  <div
    css={css`
        display: grid;
        grid-template-rows: auto auto auto;
        height: 12.5rem;
        padding: 2rem 2.46rem 1.84rem;
      `}
  >
    <div
      css={css`
          display: flex;
          align-items: center;
        `}
    >
      <Icon
        code="e8ec"
        color="#ff4d4f"
        css={css`
            width: 2rem;
            height: 2rem;
          `}
      />
      <span
        css={css`
            font-size: 1.5rem;
            color: #000000D9;
            margin-left: 1.23rem;
          `}
      >
        {message}
      </span>

    </div>
    <div
      css={css`
          display: flex;
          align-items: start;
        `}
    >
      <div
        css={css`
            color: #ff4d4f;
            margin-left: 3.2rem;
          `}
      >
        {tip}
      </div>
    </div>
    <div
      css={css`
          display: flex;
          align-items: end;
          justify-content: end;
          grid-template-columns: 1fr 1fr;
          grid-column-gap: 1rem;
          .btn {
            box-shadow: 0 2px #00000004;
            align-items: center;
            border-radius: 2px;
            white-space: nowrap;
            text-align: center;
            cursor: pointer;
            height: 2.46rem;
            padding: 0.3rem 1.15rem;
            font-size: 1.07rem;
            cursor: pointer;
            transition: all .3s cubic-bezier(.645,.045,.355,1);
            >span {
              display: inline-block;
              box-sizing: border-box;
            }
          }
        `}
    >
      <div
        css={css`
            color: #ffffff;
            background: #1B3194;
            border: 1px solid transparent;
            &:active {
              background: ${color.active('#ff4d4f')};
            }
          `}
        className="btn"
        onClick={() => {
            onConFirm();
          }}
      >
        <span>确 定</span>
      </div>
      <div
        css={css`
            color: #000000d9;
            border: 1px solid #d9d9d9;
            &:active {
              background: ${color.active('#00000004')};
              border-color: #ff4d4f;
              color: #ff4d4f;
            }
          `}
        className="btn"
        onClick={() => {
            onCancel();
          }}
      >
        <span>取 消</span>
      </div>
    </div>
  </div>
  ));

ConfirmModal.propTypes = {
  onConFirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.any, //eslint-disable-line
  tip: PropTypes.string,
};

export default ConfirmModal;
