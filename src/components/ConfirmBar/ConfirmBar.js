import { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Button from 'components/Button';

const ConfirmBar = memo(({
  onCancel,
  onConfirm,
  pending,
}) => (
  <div
    css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        > button:not(:first-of-type) {
          margin-left: 0.6rem;
        }
      `}
  >
    <Button
      pending={pending}
      type="primary"
      onClick={() => {
        onConfirm();
      }}
    >
      确认
    </Button>
    <Button
      border
      onClick={() => {
        onCancel();
      }}
    >
      取消
    </Button>
  </div>
  ));

ConfirmBar.propTypes = {
  pending: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmBar;
